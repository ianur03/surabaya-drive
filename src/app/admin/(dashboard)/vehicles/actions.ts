"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";
import { vehicleSchema } from "@/lib/validators/vehicle";
import {
  imageExtension,
  MAX_GALLERY_IMAGES,
  validateImageFile,
} from "@/lib/uploads";

export type VehicleActionState = { error?: string };

function parseVehicle(formData: FormData) {
  return vehicleSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    brand: formData.get("brand"),
    model: formData.get("model") ?? "",
    category: formData.get("category"),
    transmission: formData.get("transmission"),
    fuel_type: formData.get("fuel_type"),
    driver_service_available: formData.get("driver_service_available") === "on",
    passenger_capacity: formData.get("passenger_capacity"),
    color: formData.get("color") ?? "#0f766e",
    daily_price_without_driver: formData.get("daily_price_without_driver"),
    daily_price_with_driver: formData.get("daily_price_with_driver") ?? "",
    description: formData.get("description") ?? "",
    status: formData.get("status"),
    is_featured: formData.get("is_featured") === "on",
  });
}

type SupabaseServer = Awaited<ReturnType<typeof createServerSupabase>>;

/** Nama file unik & aman di bucket. */
function storageKey(folder: string, file: File): string {
  const ext = imageExtension(file.type) ?? "bin";
  const id = crypto.randomUUID();
  return `${folder}/${id}.${ext}`;
}

/** Upload file ke bucket publik; Kembalikan public URL, atau lempar error. */
async function uploadImage(
  supabase: SupabaseServer,
  folder: string,
  file: File,
): Promise<{ path: string; publicUrl: string }> {
  const path = storageKey(folder, file);
  const { error } = await supabase.storage
    .from("public-assets")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("Gagal mengunggah gambar. Coba lagi.");
  const { data } = supabase.storage.from("public-assets").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

/** Hapus file dari storage; abaikan kegagalan (cleanup best-effort). */
async function removeImage(supabase: SupabaseServer, path: string) {
  await supabase.storage.from("public-assets").remove([path]);
}

/** Ambil file galeri yang benar-benar diunggah (bukan input kosong). */
function galleryFiles(formData: FormData): File[] {
  return formData
    .getAll("gallery_images")
    .filter((f): f is File => f instanceof File && f.size > 0);
}

export async function createVehicle(
  _prev: VehicleActionState,
  formData: FormData,
): Promise<VehicleActionState> {
  const parsed = parseVehicle(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const heroFile = formData.get("hero_image");
  const hero = heroFile instanceof File && heroFile.size > 0 ? heroFile : null;
  const gallery = galleryFiles(formData);

  if (gallery.length > MAX_GALLERY_IMAGES) {
    return { error: `Maksimal ${MAX_GALLERY_IMAGES} gambar galeri.` };
  }
  for (const f of hero ? [hero, ...gallery] : gallery) {
    const err = validateImageFile(f);
    if (err) return { error: err };
  }

  const supabase = await createServerSupabase();

  // 1) Upload hero (jika ada) — file lama belum disentuh (tidak ada untuk create).
  let heroUrl: string | null = null;
  const uploadedPaths: string[] = [];
  try {
    if (hero) {
      const res = await uploadImage(supabase, "vehicles", hero);
      heroUrl = res.publicUrl;
      uploadedPaths.push(res.path);
    }

    // 2) Upload seluruh galeri terlebih dahulu.
    const galleryRows: Array<{ path: string; publicUrl: string }> = [];
    for (const f of gallery) {
      const res = await uploadImage(supabase, "vehicles", f);
      galleryRows.push(res);
      uploadedPaths.push(res.path);
    }

    // 3) Insert kendaraan.
    const { data: vehicle, error } = await supabase
      .from("vehicles")
      .insert({ ...parsed.data, image_url: heroUrl }, {})
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    // 4) Insert baris galeri (gagal sebagian → bersihkan file yang terlanjur unggah).
    if (galleryRows.length > 0) {
      const { error: imgErr } = await supabase.from("vehicle_images").insert(
        galleryRows.map((r, i) => ({
          vehicle_id: (vehicle as { id: string }).id,
          image_path: r.publicUrl,
          sort_order: i,
        })),
        {},
      );
      if (imgErr) throw imgErr;
    }
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? (error as { code?: string }).code
        : null;
    // Bersihkan file yang sudah terunggah (konsistensi: tidak meninggalkan orphan).
    await Promise.all(uploadedPaths.map((p) => removeImage(supabase, p)));
    if (code === "23505") {
      return { error: "Slug sudah dipakai. Gunakan slug lain." };
    }
    return { error: "Gagal menyimpan kendaraan. Coba lagi." };
  }

  revalidateTag("public-vehicles", { expire: 0 });
  redirect("/admin/vehicles");
}

export async function updateVehicle(
  id: string,
  _prev: VehicleActionState,
  formData: FormData,
): Promise<VehicleActionState> {
  const parsed = parseVehicle(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const heroFile = formData.get("hero_image");
  const hero = heroFile instanceof File && heroFile.size > 0 ? heroFile : null;
  const gallery = galleryFiles(formData);
  const removeIds = formData
    .getAll("remove_image_id")
    .map((v) => String(v))
    .filter(Boolean);

  if (gallery.length > MAX_GALLERY_IMAGES) {
    return { error: `Maksimal ${MAX_GALLERY_IMAGES} gambar galeri.` };
  }
  for (const f of hero ? [hero, ...gallery] : gallery) {
    const err = validateImageFile(f);
    if (err) return { error: err };
  }

  const supabase = await createServerSupabase();

  // Ambil nilai lama untuk pembersihan setelah update sukses.
  const { data: existing } = await supabase
    .from("vehicles")
    .select("image_url")
    .eq("id", id)
    .single();

  // Gambar galeri yang akan dihapus (untuk membersihkan file storage-nya).
  const { data: imagesToRemove } = await supabase
    .from("vehicle_images")
    .select("id, image_path")
    .in("id", removeIds);

  let heroPath: string | null = null;
  let heroUrl: string | null = null;
  const uploadedPaths: string[] = [];

  try {
    // 1) Upload hero baru dulu (file LAMA belum dihapus sampai DB sukses).
    if (hero) {
      const res = await uploadImage(supabase, "vehicles", hero);
      heroPath = res.path;
      heroUrl = res.publicUrl;
      uploadedPaths.push(res.path);
    }

    // 2) Upload galeri baru.
    const galleryRows: Array<{ path: string; publicUrl: string }> = [];
    for (const f of gallery) {
      const res = await uploadImage(supabase, "vehicles", f);
      galleryRows.push(res);
      uploadedPaths.push(res.path);
    }

    // 3) Update kendaraan (image_url hanya berubah bila ada hero baru).
    const patch: Record<string, unknown> = { ...parsed.data };
    if (heroUrl) patch.image_url = heroUrl;

    const { error } = await supabase.from("vehicles").update(patch, {}).eq("id", id);
    if (error) throw error;

    // 4) Tambah galeri baru.
    if (galleryRows.length > 0) {
      const { error: imgErr } = await supabase.from("vehicle_images").insert(
        galleryRows.map((r, i) => ({
          vehicle_id: id,
          image_path: r.publicUrl,
          sort_order: i,
        })),
        {},
      );
      if (imgErr) throw imgErr;
    }

    // 5) Hapus galeri yang diminta (DB dulu, lalu file storage).
    if (removeIds.length > 0) {
      const { error: delErr } = await supabase
        .from("vehicle_images")
        .delete({})
        .in("id", removeIds);
      if (delErr) throw delErr;
    }

    // Semua update DB sukses → baru bersihkan file lama.
    if (heroPath && existing?.image_url) {
      const oldPath = existing.image_url.split("/public-assets/")[1];
      if (oldPath) await removeImage(supabase, oldPath);
    }
    for (const row of imagesToRemove ?? []) {
      const oldPath = row.image_path.split("/public-assets/")[1];
      if (oldPath) await removeImage(supabase, oldPath);
    }
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? (error as { code?: string }).code
        : null;
    // Upload yang baru gagal → bersihkan saja file baru (old tetap utuh).
    await Promise.all(uploadedPaths.map((p) => removeImage(supabase, p)));
    if (code === "23505") {
      return { error: "Slug sudah dipakai. Gunakan slug lain." };
    }
    return { error: "Gagal memperbarui kendaraan. Coba lagi." };
  }

  revalidateTag("public-vehicles", { expire: 0 });
  redirect("/admin/vehicles");
}

export async function archiveVehicle(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.from("vehicles").update({ status: "archived" }, {}).eq("id", id);
  revalidateTag("public-vehicles", { expire: 0 });
}
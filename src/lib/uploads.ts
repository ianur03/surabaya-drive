/**
 * Aturan upload gambar kendaraan (FR-01).
 * Dipakai di validasi client (form) dan server action (bukan hanya form).
 */

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Ukuran maksimal per gambar: 5 MB. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Batas wajar jumlah gambar galeri per kendaraan. */
export const MAX_GALLERY_IMAGES = 6;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Ekstensi file yang aman berdasarkan MIME type. */
export function imageExtension(mimeType: string): string | null {
  return MIME_TO_EXT[mimeType] ?? null;
}

/** Kembalikan pesan error, atau null bila file valid. */
export function validateImageFile(file: File): string | null {
  if (file.size === 0) return null; // tidak ada file dipilih
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as never)) {
    return "Gambar harus berformat JPEG, PNG, atau WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Ukuran gambar maksimal 5 MB.";
  }
  return null;
}
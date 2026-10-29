export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Memformat angka menjadi Rupiah tanpa desimal, mis. Rp350.000. */
export function formatRupiah(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}

function parseISODate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(iso + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "28 Oktober 2026" */
export function formatDateLong(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "28 Okt 2026" */
export function formatDateShort(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Tanggal hari ini dalam format YYYY-MM-DD (waktu lokal). */
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Normalisasi nomor telepon menjadi format internasional (awalan 62, tanpa "+").
 * Menerima 08xx, 628xx, +628xx, dan 8xx. Mengembalikan null jika tidak valid.
 */
export function normalizePhoneNumber(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (/^8\d{7,12}$/.test(digits)) {
    digits = "62" + digits;
  }

  if (!/^\d{9,15}$/.test(digits)) return null;
  return digits;
}

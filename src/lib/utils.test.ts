import { describe, expect, it } from "vitest";

import { formatRupiah, normalizePhoneNumber } from "./utils";

describe("normalizePhoneNumber", () => {
  it("mengubah awalan 08xx menjadi 628xx", () => {
    expect(normalizePhoneNumber("081234567890")).toBe("6281234567890");
  });

  it("mempertahankan format 628xx", () => {
    expect(normalizePhoneNumber("6281234567890")).toBe("6281234567890");
  });

  it("menghapus karakter non-digit", () => {
    expect(normalizePhoneNumber("+62 812-3456-7890")).toBe("6281234567890");
  });

  it("menolak input tidak valid", () => {
    expect(normalizePhoneNumber("abc")).toBeNull();
    expect(normalizePhoneNumber("")).toBeNull();
    expect(normalizePhoneNumber("123")).toBeNull();
  });
});

describe("formatRupiah", () => {
  it("memformat dengan pemisah ribuan", () => {
    expect(formatRupiah(350000)).toBe("Rp350.000");
    expect(formatRupiah(850000)).toBe("Rp850.000");
  });
});

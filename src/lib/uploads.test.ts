import { describe, expect, it } from "vitest";

import { imageExtension, validateImageFile } from "./uploads";

function fakeFile(size: number, type: string): File {
  return { size, type } as File;
}

describe("imageExtension", () => {
  it("memetakan MIME yang diizinkan", () => {
    expect(imageExtension("image/jpeg")).toBe("jpg");
    expect(imageExtension("image/png")).toBe("png");
    expect(imageExtension("image/webp")).toBe("webp");
  });

  it("menolak MIME tak dikenal", () => {
    expect(imageExtension("image/gif")).toBeNull();
  });
});

describe("validateImageFile", () => {
  it("menolak tipe yang tidak diizinkan", () => {
    expect(validateImageFile(fakeFile(100, "image/gif"))).toMatch(/JPEG, PNG, atau WebP/);
  });

  it("menolak file lebih dari 5 MB", () => {
    expect(validateImageFile(fakeFile(6 * 1024 * 1024, "image/png"))).toMatch(/5 MB/);
  });

  it("lolos untuk file valid", () => {
    expect(validateImageFile(fakeFile(1000, "image/webp"))).toBeNull();
  });

  it("mengabaikan file kosong (tidak ada yang dipilih)", () => {
    expect(validateImageFile(fakeFile(0, "image/png"))).toBeNull();
  });
});
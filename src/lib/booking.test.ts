import { describe, expect, it } from "vitest";

import { bookingSchema, buildWhatsAppMessage } from "./booking";

import type { Vehicle } from "@/types/vehicle";

const vehicle: Vehicle = {
  id: "v1",
  slug: "toyota-avanza",
  name: "Toyota Avanza",
  category: "MPV",
  color: "#0f766e",
  capacity: 7,
  transmission: "Manual",
  pricePerDay: 350_000,
  priceWithDriver: null,
};

function validInput() {
  return {
    name: "Budi Santoso",
    phone: "081234567890",
    vehicleId: "v1",
    service: "self-drive",
    startDate: "2099-01-01",
    endDate: "2099-01-03",
    pickupLocation: "Surabaya",
    notes: "",
  };
}

describe("bookingSchema", () => {
  it("lolos untuk input valid", () => {
    expect(bookingSchema.safeParse(validInput()).success).toBe(true);
  });

  it("menolak nomor telepon tidak valid", () => {
    const r = bookingSchema.safeParse({ ...validInput(), phone: "abc" });
    expect(r.success).toBe(false);
  });

  it("menolak tanggal selesai sebelum tanggal mulai", () => {
    const r = bookingSchema.safeParse({
      ...validInput(),
      startDate: "2099-01-10",
      endDate: "2099-01-05",
    });
    expect(r.success).toBe(false);
  });

  it("menolak tanggal mulai di masa lalu", () => {
    const r = bookingSchema.safeParse({
      ...validInput(),
      startDate: "2020-01-01",
      endDate: "2020-01-02",
    });
    expect(r.success).toBe(false);
  });

  it("menolak jenis layanan yang tidak dikenal", () => {
    const r = bookingSchema.safeParse({ ...validInput(), service: "nope" });
    expect(r.success).toBe(false);
  });
});

describe("buildWhatsAppMessage", () => {
  it("menyertakan kode permintaan bila ada", () => {
    const msg = buildWhatsAppMessage({
      name: "Budi Santoso",
      phone: "081234567890",
      startDate: "2099-01-01",
      endDate: "2099-01-03",
      pickupLocation: "Surabaya",
      vehicle,
      serviceName: "Lepas kunci",
      bookingCode: "ABC12345",
    });
    expect(msg).toContain("Kode permintaan: ABC12345");
    expect(msg).toContain("Mobil: Toyota Avanza");
  });

  it("tidak menyertakan baris kode bila kosong", () => {
    const msg = buildWhatsAppMessage({
      name: "Budi",
      phone: "0812",
      startDate: "2099-01-01",
      endDate: "2099-01-02",
      pickupLocation: "Surabaya",
      vehicle,
      serviceName: "Lepas kunci",
    });
    expect(msg).not.toContain("Kode permintaan");
  });
});

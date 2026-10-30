import { describe, expect, it } from "vitest";

import { FUEL_TYPES, vehicleSchema } from "./vehicle";

function valid() {
  return {
    name: "Toyota Avanza",
    slug: "toyota-avanza",
    brand: "Toyota",
    model: "Avanza",
    category: "MPV",
    transmission: "Manual",
    fuel_type: "Bensin",
    driver_service_available: true,
    passenger_capacity: 7,
    color: "#0f766e",
    daily_price_without_driver: 350_000,
    daily_price_with_driver: "",
    description: "",
    status: "active",
    is_featured: false,
  };
}

describe("vehicleSchema", () => {
  it("lolos untuk input valid", () => {
    expect(vehicleSchema.safeParse(valid()).success).toBe(true);
  });

  it("menolak harga negatif", () => {
    const r = vehicleSchema.safeParse({ ...valid(), daily_price_without_driver: -1 });
    expect(r.success).toBe(false);
  });

  it("menolak kapasitas penumpang nol", () => {
    const r = vehicleSchema.safeParse({ ...valid(), passenger_capacity: 0 });
    expect(r.success).toBe(false);
  });

  it("menolak slug dengan karakter ilegal", () => {
    const r = vehicleSchema.safeParse({ ...valid(), slug: "Toyota Avanza!" });
    expect(r.success).toBe(false);
  });

  it("menolak kategori yang tidak dikenal", () => {
    const r = vehicleSchema.safeParse({ ...valid(), category: "Truk" });
    expect(r.success).toBe(false);
  });

  it("menolak bahan bakar yang tidak dikenal", () => {
    const r = vehicleSchema.safeParse({ ...valid(), fuel_type: "Solar" });
    expect(r.success).toBe(false);
  });

  it("lolos untuk semua jenis bahan bakar yang didukung", () => {
    for (const f of FUEL_TYPES) {
      expect(vehicleSchema.safeParse({ ...valid(), fuel_type: f }).success).toBe(true);
    }
  });
});

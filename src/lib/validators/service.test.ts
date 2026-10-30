import { describe, expect, it } from "vitest";

import { serviceSchema, serviceStatusFromActive } from "./service";

describe("serviceStatusFromActive", () => {
  it("memetakan aktif ke published", () => {
    expect(serviceStatusFromActive(true)).toBe("published");
  });

  it("memetakan nonaktif ke draft", () => {
    expect(serviceStatusFromActive(false)).toBe("draft");
  });
});

describe("serviceSchema", () => {
  function valid() {
    return {
      name: "Rental Lepas Kunci",
      slug: "self-drive",
      short_name: "Lepas kunci",
      description: "Deskripsi layanan.",
      benefits: ["Manfaat satu"],
      status: "published",
      sort_order: 0,
    };
  }

  it("lolos untuk input valid", () => {
    expect(serviceSchema.safeParse(valid()).success).toBe(true);
  });

  it("menolak tanpa poin manfaat", () => {
    expect(serviceSchema.safeParse({ ...valid(), benefits: [] }).success).toBe(false);
  });
});
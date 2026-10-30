import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Foto kendaraan disimpan di Supabase Storage (bucket publik `public-assets`).
    // Domain diambil dari env agar proyek Supabase bisa diganti tanpa ubah kode.
    remotePatterns: (() => {
      const patterns: NonNullable<
        NonNullable<NextConfig["images"]>["remotePatterns"]
      > = [];
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        try {
          const { hostname, protocol } = new URL(supabaseUrl);
          patterns.push({
            protocol: protocol.replace(":", "") as "http" | "https",
            hostname,
            pathname: "/storage/v1/object/public/**",
          });
        } catch {
          // URL tidak valid → biarkan kosong, build tetap jalan.
        }
      }
      return patterns;
    })(),
  },
  experimental: {
    serverActions: {
      // Izinkan upload gambar (hero + galeri) lewat Server Action.
      bodySizeLimit: "40mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

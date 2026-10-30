import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Layout halaman PUBLIK.
 * Header (navbar publik) & Footer HANYA dirender di sini — bukan di root layout —
 * supaya route admin (/admin/*) tidak ikut menampilkan navigasi publik (FR-04).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
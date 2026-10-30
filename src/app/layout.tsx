import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getPublicSiteSettings } from "@/lib/db/settings";
import { siteConfig } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    // fallback ke default
  }

  const title =
    settings?.default_seo_title ??
    `${siteConfig.name} — Rental Mobil di Surabaya`;
  const description = settings?.default_seo_description ?? siteConfig.description;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    openGraph: {
      type: "website",
      url: siteConfig.url,
      siteName: settings?.business_name ?? siteConfig.name,
      title,
      description,
      locale: "id_ID",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
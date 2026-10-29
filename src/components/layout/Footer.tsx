import { getWhatsAppNumber, siteConfig } from "@/lib/site";
import { getPublicSiteSettings } from "@/lib/db/settings";
import { CopyrightYear } from "@/components/layout/CopyrightYear";

const navItems = [
  { href: "#beranda", label: "Beranda" },
  { href: "#armada", label: "Armada" },
  { href: "#layanan", label: "Layanan" },
  { href: "#tentang", label: "Tentang Kami" },
  { href: "#faq", label: "FAQ" },
];

export async function Footer() {
  let settings = null;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    // fallback ke default
  }

  const businessName = settings?.business_name ?? siteConfig.name;
  const whatsappNumber = settings?.whatsapp_number ?? getWhatsAppNumber();
  const serviceArea = settings?.service_area ?? "Surabaya";
  const footerText = settings?.footer_text ?? "";
  const siteMode = settings?.site_mode ?? "demo";

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-base font-semibold tracking-tight text-slate-900">
              {businessName}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
              Website demo rental mobil di {serviceArea}. Menyediakan informasi
              armada dan pilihan layanan lepas kunci serta dengan sopir.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <p className="text-sm font-semibold text-slate-900">Navigasi</p>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-slate-900">Kontak</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Wilayah layanan: {serviceArea}</li>
              <li>
                {whatsappNumber ? (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900"
                  >
                    WhatsApp: {whatsappNumber}
                  </a>
                ) : (
                  <span>Nomor WhatsApp belum dikonfigurasi</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© <CopyrightYear /> {businessName}.</p>
          <p>
            {siteMode === "demo"
              ? "Proyek demo (portofolio) — bukan layanan rental yang beroperasi."
              : footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}

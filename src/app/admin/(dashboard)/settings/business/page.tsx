import { adminGetSettings } from "@/lib/db/settings";
import { updateSettings } from "./actions";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsBusinessPage() {
  const settings = await adminGetSettings();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Pengaturan Bisnis & SEO</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Mengubah kontak, mode demo/live, dan metadata SEO website publik.
      </p>
      <SettingsForm action={updateSettings} initial={settings} />
    </div>
  );
}

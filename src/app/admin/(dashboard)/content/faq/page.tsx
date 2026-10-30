import Link from "next/link";

import { adminListFaqs } from "@/lib/db/faqs";
import { toggleFaqPublish } from "./actions";

export default async function FaqPage() {
  const faqs = await adminListFaqs();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">FAQ</h1>
        <Link
          href="/admin/content/faq/new"
          className="rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + Tambah FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-8 text-sm text-slate-600 dark:text-slate-300">
          Belum ada FAQ.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{faq.question}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{faq.answer}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                  {faq.is_published ? "Terbit" : "Draft"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/admin/content/faq/${faq.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/40"
                >
                  Edit
                </Link>
                <form action={toggleFaqPublish.bind(null, faq.id)}>
                  <input type="hidden" name="is_published" value={String(faq.is_published)} />
                  <button
                    type="submit"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {faq.is_published ? "Sembunyikan" : "Terbitkan"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

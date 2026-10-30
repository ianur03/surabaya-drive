export function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-8">
        <p className="text-sm font-medium text-slate-900 dark:text-white">Belum tersedia</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Fitur ini dibangun pada {phase}.
        </p>
      </div>
    </div>
  );
}

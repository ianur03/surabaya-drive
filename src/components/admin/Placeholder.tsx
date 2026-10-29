export function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
        <p className="text-sm font-medium text-slate-900">Belum tersedia</p>
        <p className="mt-2 text-sm text-slate-600">
          Fitur ini dibangun pada {phase}.
        </p>
      </div>
    </div>
  );
}

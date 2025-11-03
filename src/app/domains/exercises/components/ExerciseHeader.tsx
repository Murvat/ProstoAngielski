type ExerciseHeaderProps = {
  title: string;
  subtitle: string;
  progress: number;
  current: number;
  total: number;
};

export default function ExerciseHeader({ title, subtitle, progress, current, total }: ExerciseHeaderProps) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-inner md:flex-row md:items-center md:justify-between md:gap-8 md:p-6">
      <div className="space-y-2 md:max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-500 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {String(current).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">{title}</h2>
        <p className="text-sm text-emerald-700 md:text-base">{subtitle}</p>
      </div>

      <div className="w-full md:max-w-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
          <span>Postęp</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}


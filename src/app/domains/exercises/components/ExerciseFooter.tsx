type ExerciseFooterProps = {
  leftLabel: string;
  onLeftClick: () => void;
  rightLabel: string;
  onRightClick: () => void;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
};

export default function ExerciseFooter({
  leftLabel,
  onLeftClick,
  rightLabel,
  onRightClick,
  leftDisabled,
  rightDisabled,
}: ExerciseFooterProps) {
  return (
    <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
      <button
        type="button"
        onClick={onLeftClick}
        disabled={leftDisabled}
        className={`group inline-flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200 md:px-7 ${
          leftDisabled
            ? "cursor-not-allowed border-emerald-100 bg-white text-emerald-300"
            : "border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50"
        }`}
      >
        {!leftDisabled && (
          <span className="h-2 w-2 rounded-full bg-emerald-300 transition group-hover:bg-emerald-400" />
        )}
        {leftLabel}
      </button>

      <button
        type="button"
        onClick={onRightClick}
        disabled={rightDisabled}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
          rightDisabled
            ? "cursor-not-allowed bg-emerald-200"
            : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
        }`}
      >
        {!rightDisabled && <span className="h-2 w-2 rounded-full bg-white/70" />}
        {rightLabel}
      </button>
    </div>
  );
}

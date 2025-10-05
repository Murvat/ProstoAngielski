export default function ExerciseFooter({
  leftLabel,
  onLeftClick,
  rightLabel,
  onRightClick,
  leftDisabled,
  rightDisabled,
}: {
  leftLabel: string;
  onLeftClick: () => void;
  rightLabel: string;
  onRightClick: () => void;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
}) {
  return (
    <div className="flex justify-between w-full pt-6 pb-24">
      <button
        onClick={onLeftClick}
        disabled={leftDisabled}
        className={`px-6 py-3 rounded-lg text-sm font-semibold border transition-colors duration-200
          ${
            leftDisabled
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-emerald-50 border-green-700 text-green-800 cursor-pointer hover:bg-emerald-100 active:bg-emerald-200"
          }`}
      >
        {leftLabel}
      </button>

      <button
        onClick={onRightClick}
        disabled={rightDisabled}
        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors duration-200
          ${
            rightDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-green-800 text-white cursor-pointer hover:bg-green-700 active:bg-green-900"
          }`}
      >
        {rightLabel}
      </button>
    </div>
  );
}

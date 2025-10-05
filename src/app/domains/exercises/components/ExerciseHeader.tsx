export default function ExerciseHeader({
  title,
  subtitle,
  progress,
  current,
  total,
}: {
  title: string;
  subtitle: string;
  progress: number;
  current: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-2 w-full bg-green-100/80 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h2 className="text-xl font-bold text-green-800">{title}</h2>
      <p className="text-base text-gray-700 font-medium">{subtitle}</p>

      <div className="w-full h-2 bg-green-200 rounded-full my-2 overflow-hidden">
        <div
          className="h-2 bg-green-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-black font-medium">
        <span>
          {current}/{total}
        </span>
      </div>
    </div>
  );
}

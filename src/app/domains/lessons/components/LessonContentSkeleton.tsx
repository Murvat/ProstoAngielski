export default function LessonContentSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-10">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-3/4 rounded-lg bg-emerald-100" />
        <div className="space-y-4">
          <div className="h-5 w-full rounded bg-emerald-50" />
          <div className="h-5 w-11/12 rounded bg-emerald-50" />
          <div className="h-5 w-10/12 rounded bg-emerald-50" />
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-6 w-2/3 rounded bg-emerald-100" />
          <div className="h-5 w-11/12 rounded bg-emerald-50" />
          <div className="h-5 w-10/12 rounded bg-emerald-50" />
        </div>
        <div className="space-y-4 pt-6">
          <div className="h-6 w-1/2 rounded bg-emerald-100" />
          <div className="h-5 w-full rounded bg-emerald-50" />
          <div className="h-5 w-11/12 rounded bg-emerald-50" />
          <div className="h-5 w-9/12 rounded bg-emerald-50" />
        </div>
      </div>
    </div>
  );
}

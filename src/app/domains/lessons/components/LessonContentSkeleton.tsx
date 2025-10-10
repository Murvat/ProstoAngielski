export default function LessonContentSkeleton() {
  return (
<div className="space-y-6 animate-pulse w-full max-w-4xl mx-auto px-4 min-h-[500px] bg-white dark:bg-gray-800 rounded-lg">
      {/* Title */}
      <div className="h-8 w-3/4 bg-gray-200 rounded-lg"></div>

      {/* Paragraphs */}
      <div className="space-y-4">
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-11/12"></div>
        <div className="h-5 bg-gray-200 rounded w-10/12"></div>
      </div>

      {/* Example block */}
      <div className="mt-8 space-y-3">
        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
        <div className="h-5 bg-gray-200 rounded w-11/12"></div>
        <div className="h-5 bg-gray-200 rounded w-10/12"></div>
      </div>

      {/* Exercise placeholder */}
      <div className="mt-10 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-11/12"></div>
        <div className="h-5 bg-gray-200 rounded w-10/12"></div>
      </div>
    </div>
  );
}

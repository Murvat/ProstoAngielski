"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LessonContentSkeleton from "./LessonContentSkeleton";

type LessonContentProps = {
  content: string;
  isLoading?: boolean;
};

export default function LessonContent({ content, isLoading = false }: LessonContentProps) {
  if (isLoading) {
    return (
      <div className="h-full rounded-3xl">
        <LessonContentSkeleton />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-3xl bg-white p-10 text-center">
        <p className="text-base font-semibold text-emerald-700">Brak treści lekcji.</p>
        <p className="text-sm text-gray-500">
          Spróbuj ponownie za chwilę lub użyj przycisku po prawej, aby wygenerować nową wersję materiału.
        </p>
      </div>
    );
  }

  return (
    <article className="rounded-3xl bg-white px-5 py-8 sm:px-8 md:px-12 md:py-12">
      <div className="prose prose-emerald max-w-none leading-relaxed md:prose-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}

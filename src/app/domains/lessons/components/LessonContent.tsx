"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LessonContentSkeleton from "./LessonContentSkeleton";

export default function LessonContent({
  content,
  isLoading = false,
}: {
  content: string;
  isLoading?: boolean;
}) {
  if (isLoading) return <LessonContentSkeleton />;
  if (!content) return <p className="text-gray-500">Brak treści lekcji.</p>;

  return (
    <section className="prose dark:prose-invert max-w-4xl mx-auto p-6 transition-opacity duration-500">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </section>
  );
}

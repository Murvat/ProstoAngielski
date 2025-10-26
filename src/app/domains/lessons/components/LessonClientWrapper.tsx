"use client";

import { useState } from "react";
import LessonContent from "./LessonContent";
import LessonRegenerateButton from "./LessonRegenerateButton";
import { LessonPdfButton } from "./LessonPdfButton";

type LessonClientWrapperProps = {
  initialContent: string;
  course: string;
  lessonId: string;
  topic: string;
  level: string;
  pdfPath?: string;
};

export function LessonClientWrapper({
  initialContent,
  course,
  lessonId,
  topic,
  level,
  pdfPath,
}: LessonClientWrapperProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_PDF_BASE_URL ?? "";

  return (
    <div className="space-y-8">
      <LessonRegenerateButton
        topic={topic}
        level={level}
        course={course}
        lessonId={lessonId}
        onRegenerate={(nextContent) => setContent(nextContent)}
        setLoading={setLoading}
      />

      <div className="rounded-3xl border border-emerald-100 bg-white shadow-md shadow-emerald-100/40">
        <LessonContent content={content} isLoading={loading} />
      </div>

      {pdfPath && (
        <div className="flex justify-end">
          <LessonPdfButton baseUrl={baseUrl} pdfPath={pdfPath} />
        </div>
      )}
    </div>
  );
}

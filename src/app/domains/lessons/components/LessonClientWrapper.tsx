"use client";
import { useState } from "react";
import LessonContent from "../components/LessonContent";
import LessonRegenerateButton from "../components/LessonRegenerateButton";
import { LessonPdfButton } from "../components/LessonPdfButton";

export function LessonClientWrapper({
  initialContent,
  topic,
  level,
  pdfPath,
}: {
  initialContent: string;
  topic: string;
  level: string;
  pdfPath?: string;
}) {
  const [content, setContent] = useState(initialContent);
  const baseUrl = process.env.NEXT_PUBLIC_PDF_BASE_URL ?? "";

  return (
    <div className="flex flex-col gap-6">
      <LessonRegenerateButton
        topic={topic}
        level={level}
        onRegenerate={(newContent) => setContent(newContent)}
      />
      <LessonContent content={content} />
      {pdfPath && <LessonPdfButton baseUrl={baseUrl} pdfPath={pdfPath} />}
    </div>
  );
}

"use client";

import { FileDown } from "lucide-react";

type LessonPdfButtonProps = {
  pdfPath: string | null;
  baseUrl: string;
};

export function LessonPdfButton({ pdfPath, baseUrl }: LessonPdfButtonProps) {
  if (!pdfPath) return null;

  const fullUrl = `${baseUrl}${pdfPath}`;

  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <FileDown className="h-4 w-4" />
      </span>
      Pobierz materiały PDF
    </a>
  );
}

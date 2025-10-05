"use client";

type LessonPdfButtonProps = {
  pdfPath: string | null;
  baseUrl: string;
};

export function LessonPdfButton({ pdfPath, baseUrl }: LessonPdfButtonProps) {
  if (!pdfPath) return null;

  const fullUrl = `${baseUrl}${pdfPath}`;

  return (
    <div className="bg-green-100 p-4 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer">
      <p className="text-green-900 font-medium">
        📘 Ściągnij plik ze słownictwem!
      </p>
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg 
        hover:bg-green-700 active:bg-green-800 transition-colors duration-200 cursor-pointer"
      >
        📄 Pobierz PDF
      </a>
    </div>
  );
}

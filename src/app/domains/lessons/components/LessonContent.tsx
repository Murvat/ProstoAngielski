// import { ReactNode } from "react";

// export default function LessonContent({ content }: { content: ReactNode }) {
//     return (
//       <section
//         // id="htmlContent"
//         className="relative z-0 flex-1 min-w-0 flex flex-col gap-9 prose prose-github dark:prose-invert max-w-4xl mx-auto"
//       >
//         {content}
//       </section>
//     );
//   }
  
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LessonContent({ content }: { content: string }) {
  if (!content) return <p className="text-gray-500">Brak treści lekcji.</p>;

  return (
    <section className="prose dark:prose-invert max-w-4xl mx-auto p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </section>
  );
}

// src/app/domains/lesson/containers/LessonPageContainer.tsx
//todo migrate to api server
import LessonContent from "../components/LessonContent";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { compileLesson } from "../features/compileLesson";
import { LessonPdfButton } from "../components/LessonPdfButton";

export const runtime = "nodejs";

export async function LessonPageContainer({
  id,        // lessonId from URL (actually order_index)
  courseId,
}: {
  id: string;
  courseId: string;
}) {
  const orderIndex = parseInt(id, 10);
 
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("id, title, content_md, pdf_path")
    .eq("order_index", orderIndex)
    .eq("course_id", courseId)
    .single();
  
  if (error || !lesson) {
    return (
      <section className="flex-1 max-w-2xl mx-auto flex flex-col gap-9 prose prose-neutral dark:prose-invert">
        <p>
          Failed to load lesson <code>{id}</code> in course{" "}
          <code>{courseId}</code>: {error?.message}
        </p>
      </section>
    );
  }
const { content } = await compileLesson(lesson.content_md);
  const baseUrl = process.env.NEXT_PUBLIC_PDF_BASE_URL ?? "";
  return (
<section className="flex-1 max-w-4xl mx-auto flex flex-col gap-9 prose prose-neutral dark:prose-invert">
      <LessonContent content={content} />
      {lesson.pdf_path && <LessonPdfButton baseUrl={baseUrl} pdfPath={lesson.pdf_path}/>}

</section>
  );
}

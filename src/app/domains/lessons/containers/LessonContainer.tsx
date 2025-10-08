import { supabase } from "@/lib/supabase/client/supabaseClient";
import { LessonClientWrapper } from "../components/LessonClientWrapper";

export const runtime = "nodejs";

export async function LessonPageContainer({
  id,
  courseId,
}: {
  id: string;
  courseId: string;
}) {
  const orderIndex = parseInt(id, 10);
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("id, title, content_md, pdf_path, heading")
    .eq("order_index", orderIndex)
    .eq("course_id", courseId)
    .single();

  if (error || !lesson) {
    return <p className="text-red-600 text-center">Nie udało się załadować lekcji.</p>;
  }

  return (
    <section className="flex-1 max-w-4xl mx-auto p-6">
      <LessonClientWrapper
        lessonId={ id}
        initialContent={lesson.content_md}
        course={courseId}
        topic={lesson.heading || lesson.title}
        level={courseId}
        pdfPath={lesson.pdf_path}
      />
    </section>
  );
}

import { supabase } from "@/lib/supabase/client/supabaseClient";
import { getLessonContentByOrder } from "@/lib/supabase/queries";
import { LessonClientWrapper } from "../components/LessonClientWrapper";

export const runtime = "nodejs";

type LessonPageContainerProps = {
  id: string;
  courseId: string;
};

export async function LessonPageContainer({
  id,
  courseId,
}: LessonPageContainerProps) {
  const orderIndex = Number(id);
  if (Number.isNaN(orderIndex)) {
    return (
      <p className="text-red-600 text-center">
        Niepoprawny identyfikator lekcji.
      </p>
    );
  }
  const { data: lesson, error } = await getLessonContentByOrder(
    supabase,
    courseId,
    orderIndex
  );

  if (error || !lesson) {
    return (
      <p className="text-red-600 text-center">
        Nie udalo sie zaladowac lekcji.
      </p>
    );
  }

  return (
    <section className="flex-1 max-w-4xl mx-auto p-6">
      <LessonClientWrapper
        lessonId={id}
        initialContent={lesson.content_md}
        course={courseId}
        topic={lesson.heading ?? lesson.title}
        level={courseId}
        pdfPath={lesson.pdf_path as string}
      />
    </section>
  );
}

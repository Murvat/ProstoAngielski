import { createClient } from "@/lib/supabase/server/server";
import { getLessonContentByOrder } from "@/lib/supabase/queries";
import { resolveCourseAccess } from "@/lib/access/courseAccess";
import { FREE_LESSON_LIMIT } from "@/app/domains/lessons/constants";
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

  const supabase = await createClient();

  if (orderIndex > FREE_LESSON_LIMIT) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // Lack of authenticated user -> gated content must not render.
      return null;
    }

    // Double-check payment on the server to keep premium content protected.
    const access = await resolveCourseAccess(supabase, user.id, courseId);
    if (!access.hasFullAccess) {
      return null;
    }
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
        pdfPath={lesson.pdf_path ?? undefined}
      />
    </section>
  );
}

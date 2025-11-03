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

export async function LessonPageContainer({ id, courseId }: LessonPageContainerProps) {
  const orderIndex = Number(id);
  if (Number.isNaN(orderIndex)) {
    return <p className="text-center text-red-600">Niepoprawny identyfikator lekcji.</p>;
  }

  const supabase = await createClient();

  if (orderIndex > FREE_LESSON_LIMIT) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const access = await resolveCourseAccess(supabase, user.id, courseId);
    if (!access.hasFullAccess) {
      return null;
    }
  }

  const { data: lesson, error } = await getLessonContentByOrder(supabase, courseId, orderIndex);

  if (error || !lesson) {
    return <p className="text-center text-red-600">Nie udało się załadować lekcji.</p>;
  }

  const title = lesson.heading ?? lesson.title ?? `Lekcja ${orderIndex}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-sky-500 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_65%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              Lekcja {orderIndex}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
            <p className="max-w-2xl text-sm text-white/85 md:text-base">
              Zanurz się w tematyce kursu i korzystaj z dynamicznie generowanej treści, fiszek oraz materiałów w PDF.
              W każdej chwili możesz poprosić o nową wersję lekcji dopasowaną do własnych wskazówek.
            </p>
          </div>
          <div className="grid w-full max-w-sm gap-3 text-sm text-white/90 md:text-base">
            <div className="rounded-2xl border border-white/35 bg-white/15 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-xs uppercase text-white/70">Kurs</p>
              <p className="break-words font-semibold">{courseId}</p>
            </div>
            <div className="rounded-2xl border border-white/35 bg-white/15 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-xs uppercase text-white/70">Materiały dodatkowe</p>
              <p className="font-semibold">{lesson.pdf_path ? "PDF do pobrania" : "Brak pliku PDF"}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-10 max-w-5xl px-4 pb-16 md:px-6">
        <LessonClientWrapper
          lessonId={id}
          initialContent={lesson.content_md}
          course={courseId}
          topic={title}
          level={courseId}
          pdfPath={lesson.pdf_path ?? undefined}
        />
      </main>
    </div>
  );
}


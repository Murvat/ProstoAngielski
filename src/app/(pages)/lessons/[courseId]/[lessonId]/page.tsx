import LessonExerciseLayout from "@/app/domains/layouts/container/LessonExerciseLayout";
import { LessonPageContainer } from "@/app/domains/lessons/containers/LessonContainer";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Params = Promise<{ courseId: string; lessonId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { courseId, lessonId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const cookieHeader = (await headers()).get("cookie") || "";

  // 🚀 Parallelize all API requests
  const [progressRes, userRes, courseRes] = await Promise.all([
    fetch(`${baseUrl}/api/progress`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
    fetch(`${baseUrl}/api/auth/user`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
    fetch(`${baseUrl}/api/layout/course?courseId=${courseId}`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
  ]);

  // 🧩 Handle redirects
  if (!userRes.ok) redirect("/login");
  if (!courseRes.ok) redirect("/profile");
  if (!progressRes.ok) redirect("/login");

  // ✅ Parse responses
  const [{ progress }, { user }] = await Promise.all([
    progressRes.json(),
    userRes.json(),
  ]);

  return (
    <LessonExerciseLayout
      user={user}
      courseId={courseId}
      lessonId={lessonId}
      showToc
    >
      <LessonPageContainer id={lessonId} courseId={courseId} />
    </LessonExerciseLayout>
  );
}

import ExerciseFlow from "@/app/domains/exercises/containers/ExerciseFlow";
import LessonExerciseLayout from "@/app/domains/layouts/container/LessonExerciseLayout";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Params = Promise<{ courseId: string; lessonId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { courseId, lessonId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cookieHeader = (await headers()).get("cookie") || "";

  // 🚀 Fetch everything in parallel
  const [userRes, courseRes] = await Promise.all([
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

  // ✅ Parse responses
  const { user } = await userRes.json();

  return (
    <LessonExerciseLayout
      user={user}
      courseId={courseId}
      lessonId={lessonId}
    >
      <ExerciseFlow id={lessonId} courseId={courseId} />
    </LessonExerciseLayout>
  );
}

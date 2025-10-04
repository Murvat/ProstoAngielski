import { LessonPageContainer } from "@/app/domains/lessons/containers/LessonContainer";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  return <LessonPageContainer id={lessonId} courseId={courseId} />;
}

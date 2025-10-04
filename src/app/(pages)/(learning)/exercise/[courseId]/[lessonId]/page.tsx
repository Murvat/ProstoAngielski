import ExerciseFlow from "@/app/domains/exercises/containers/ExerciseFlow";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  return <ExerciseFlow id={lessonId} courseId={courseId} />;
}

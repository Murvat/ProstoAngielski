import LessonExerciseLayout from "@/app/domains/layouts/container/LessonExerciseLayout";
import { LessonPageContainer } from "@/app/domains/lessons/containers/LessonContainer";
import { loadUserWithProgress } from "@/app/domains/layouts/features/loadUserProgress";
import { assertUserHasCourse } from "@/app/domains/layouts/features/hasCourse";

export default async function Page({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const { courseId, lessonId } = await params;
  const { progress } = await loadUserWithProgress();
    const { user } = await assertUserHasCourse(courseId);
  

  return (
    <LessonExerciseLayout
      user={user}
      courseId={courseId}
      lessonId={lessonId}
      showToc
      progress={progress}
    >
      <LessonPageContainer id={lessonId} courseId={courseId} />
    </LessonExerciseLayout>
  );
}

import LessonExerciseLayout from "@/app/domains/layouts/container/LessonExerciseLayout";
import ExerciseFlow from "@/app/domains/exercises/containers/ExerciseFlow";
import { loadUserWithProgress } from "@/app/domains/layouts/features/loadUserProgress";
import { assertUserHasCourse } from "@/app/domains/layouts/features/hasCourse";

type Params = Promise<{ courseId: string; lessonId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { courseId, lessonId } = await params;
  const { progress } = await loadUserWithProgress();
  const { user } = await assertUserHasCourse(courseId);

  return (
    <LessonExerciseLayout
      user={user}
      courseId={courseId}
      lessonId={lessonId}
      showToc={false}
      progress={progress}
    >
      <ExerciseFlow id={lessonId} courseId={courseId} />
    </LessonExerciseLayout>
  );
}

import { useMemo } from "react";
import LeftSidebar from "../components/LeftSidebar";
import type { Course } from "../features/types";

type SidebarContainerProps = {
  course: Course;
  progress?: {
    course:string
    lesson_id: string;
    completed_exercises: boolean;
    updated_at: string;
  }[];
};

export default function SidebarContainer({ course, progress = [] }: SidebarContainerProps) {
  const filteredProgress = progress.filter((p) => p.course === course.id);
const completedLessons = useMemo(
  () => new Set(filteredProgress.map((p) => p.lesson_id)),
  [progress]
);

const completedExercises = useMemo(
  () => new Set(filteredProgress.filter((p) => p.completed_exercises).map((p) => p.lesson_id)),
  [progress]
);

  return (
    <LeftSidebar
      course={course}
      completedLessons={completedLessons}
      completedExercises={completedExercises}
    />
  );
}


import { useMemo } from "react";
import LeftSidebar from "../components/LeftSidebar";
import type { CourseWithStructure, Progress } from "@/types";

type SidebarContainerProps = {
  course: CourseWithStructure;
  progress?: Progress[];
};

export default function SidebarContainer({
  course,
  progress = [],
}: SidebarContainerProps) {
  const completedLessons = useMemo(() => {
    return new Set(
      progress
        .filter((entry) => entry.course === course.id)
        .map((entry) => entry.lesson_id)
    );
  }, [course.id, progress]);

  const completedExercises = useMemo(() => {
    return new Set(
      progress
        .filter(
          (entry) => entry.course === course.id && entry.completed_exercises
        )
        .map((entry) => entry.lesson_id)
    );
  }, [course.id, progress]);

  return (
    <LeftSidebar
      course={course}
      completedLessons={completedLessons}
      completedExercises={completedExercises}
    />
  );
}

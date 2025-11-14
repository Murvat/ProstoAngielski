import { useMemo } from "react";
import LeftSidebar from "../components/LeftSidebar";
import type { CourseWithStructure, Progress } from "@/types";

type SidebarContainerProps = {
  course: CourseWithStructure;
  progress?: Progress[];
  variant?: "desktop" | "mobile";
  className?: string;
  onClose?: () => void;
  onNavigate?: () => void;
};

export default function SidebarContainer({
  course,
  progress = [],
  variant = "desktop",
  className,
  onClose,
  onNavigate,
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
        .filter((entry) => entry.course === course.id && entry.completed_exercises)
        .map((entry) => entry.lesson_id)
    );
  }, [course.id, progress]);

  const forwardedClassName = className ?? (variant === "mobile" ? "h-full" : undefined);

  return (
    <LeftSidebar
      course={course}
      completedLessons={completedLessons}
      completedExercises={completedExercises}
      variant={variant}
      className={forwardedClassName}
      onClose={onClose}
      onNavigate={onNavigate}
    />
  );
}

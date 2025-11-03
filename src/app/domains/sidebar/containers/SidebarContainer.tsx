import { useMemo } from "react";
import LeftSidebar from "../components/LeftSidebar";
import type { CourseWithStructure, Progress } from "@/types";

type SidebarContainerProps = {
  course: CourseWithStructure;
  progress?: Progress[];
  hasFullAccess?: boolean;
  isAccessLoading?: boolean;
  onLockedLessonAttempt?: (payload: {
    lessonId: string;
    lessonOrder: number;
    isExercise: boolean;
  }) => void;
  variant?: "desktop" | "mobile";
  className?: string;
  onClose?: () => void;
  onNavigate?: () => void;
};

export default function SidebarContainer({
  course,
  progress = [],
  hasFullAccess = false,
  isAccessLoading = false,
  onLockedLessonAttempt,
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
      hasFullAccess={hasFullAccess}
      isAccessLoading={isAccessLoading}
      onLockedLessonAttempt={onLockedLessonAttempt}
      variant={variant}
      className={forwardedClassName}
      onClose={onClose}
      onNavigate={onNavigate}
    />
  );
}

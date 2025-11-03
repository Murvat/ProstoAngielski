"use client";

import { useCallback } from "react";
import type { Course, Progress } from "@/types";

export function useCourseProgress(progress: Progress[]) {
  const getCourseProgress = useCallback(
    (courseId: string) =>
      progress
        .filter((entry) => entry.course === courseId)
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0],
    [progress]
  );

  const getButtonState = useCallback(
    (course: Course) => {
      const courseProgress = getCourseProgress(course.id);

      if (courseProgress?.lesson_id) {
        return { label: "Kontynuuj", lessonId: courseProgress.lesson_id };
      }

      if (course.first_lesson_id) {
        return { label: "Start", lessonId: course.first_lesson_id };
      }

      return { label: "Start", lessonId: null };
    },
    [getCourseProgress]
  );

  return { getCourseProgress, getButtonState };
}

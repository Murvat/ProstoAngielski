// src/app/domains/lesson/hooks/useLessonNavigation.ts
"use client";

import { useRouter } from "next/navigation";
import { buildNavItems, getPrevNext, getPath } from "./navigation"
import type { Course } from "../../sidebar/features/types";

export function useLessonNavigation(
  course: Course | null,
  courseId: string,
  lessonId: string,
  isExercise: boolean
) {
  const router = useRouter();

  // Build full nav sequence from structure
  const items = course ? buildNavItems(course) : [];
  const { prev, next } = getPrevNext(items, lessonId, isExercise);

  // Actions
  const handleGoPrev = () => {
    if (prev) router.push(getPath(courseId, prev));
  };

  const handleGoNext = () => {
    if (next) router.push(getPath(courseId, next));
  };

  return {
    prev,
    next,
    prevDisabled: !prev,
    nextDisabled: !next,
    handleGoPrev,
    handleGoNext,
  };
}

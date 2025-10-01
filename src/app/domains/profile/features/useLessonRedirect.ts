// src/app/domains/profile/hooks/useLessonRedirect.ts
"use client";

export function useLessonRedirect() {
  function goToLesson(courseId: string, lessonId: string) {
    window.location.href = `/lessons/${courseId}/${lessonId}`;
  }

  return { goToLesson };
}

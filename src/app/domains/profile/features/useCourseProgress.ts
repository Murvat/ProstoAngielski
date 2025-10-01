// src/app/domains/profile/hooks/useCourseProgress.ts
"use client";

type Progress = {
  id: string;
  user_id: string;
  course: string;
  lesson_id: string;
  completed_exercises: boolean;
  updated_at: string;
};

type Course = {
  id: string;
  title: string;
  level: string;
  price: number;
  short_description?: string;
  first_lesson_id?: string;
};

export function useCourseProgress(progress: Progress[]) {
  function getCourseProgress(courseId: string) {
    return progress
      .filter((p) => p.course === courseId)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];
  }

  function getButtonState(course: Course) {
    const courseProgress = getCourseProgress(course.id);

    if (courseProgress?.lesson_id) {
      return { label: "Kontynuuj", lessonId: courseProgress.lesson_id };
    } else if (course.first_lesson_id) {
      return { label: "Start", lessonId: course.first_lesson_id };
    }

    return { label: "Start", lessonId: undefined };
  }

  return { getCourseProgress, getButtonState };
}

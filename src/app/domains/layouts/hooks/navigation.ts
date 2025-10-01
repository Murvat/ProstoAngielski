// src/app/domains/lesson/features/navigation.ts
import type { Course } from "../../sidebar/features/types";

export type NavItem = {
  id: string;
  type: "lesson" | "exercise";
  title: string;
};

// Flatten course.structure → lessons + exercises
export function buildNavItems(course: Course): NavItem[] {
  return course.structure.chapters.flatMap((ch) =>
    ch.lessons.flatMap((lesson) => [
      { id: lesson.id, type: "lesson" as const, title: lesson.title },
      { id: `${lesson.id}-ex`, type: "exercise" as const, title: "Exercise" },
    ])
  );
}

// Find prev/next around current item
export function getPrevNext(
  items: NavItem[],
  lessonId: string,
  isExercise: boolean
) {
  const currentIndex = items.findIndex((i) =>
    isExercise ? i.type === "exercise" && i.id === `${lessonId}-ex`
               : i.type === "lesson" && i.id === lessonId
  );

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return { prev, next };
}

// Build correct path for lesson/exercise
export function getPath(courseId: string, item: NavItem) {
  const base = item.type === "exercise" ? "exercise" : "lessons";
  const lessonId = item.type === "exercise" ? item.id.replace("-ex", "") : item.id;
  return `/${base}/${courseId}/${lessonId}`;
}

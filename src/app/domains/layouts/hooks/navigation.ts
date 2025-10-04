// src/app/domains/lesson/features/navigation.ts
import type { Course } from "../../sidebar/features/types";

export type NavItem = {
  id: string;
  type: "lesson" | "exercise";
  title: string;
};

// 🔹 Build a flat navigation sequence
export function buildNavItems(course: Course): NavItem[] {
  return course.structure.chapters.flatMap((chapter) =>
    chapter.lessons.flatMap((lesson) => [
      { id: lesson.id, type: "lesson" as const, title: lesson.title },
      { id: `${lesson.id}-ex`, type: "exercise" as const, title: "Exercise" },
    ])
  );
}

// 🔹 Find the previous and next items in sequence
export function getPrevNext(
  items: NavItem[],
  lessonId: string,
  isExercise: boolean
) {
  // current id depends on context
  const currentId = isExercise ? `${lessonId}-ex` : lessonId;
  const currentIndex = items.findIndex((i) => i.id === currentId);

  // Defensive fix for unmatched lesson (e.g., course still loading)
  if (currentIndex === -1) return { prev: null, next: null };

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return { prev, next };
}

// 🔹 Build a correct client path
export function getPath(courseId: string, item: NavItem) {
  const base = item.type === "exercise" ? "exercise" : "lessons";
  const lessonId = item.id.replace("-ex", "");
  return `/${base}/${courseId}/${lessonId}`;
}

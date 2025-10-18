import type { CourseWithStructure, NavItem } from "@/types";

export function buildNavItems(course: CourseWithStructure): NavItem[] {
  return course.structure.chapters.flatMap((chapter) =>
    chapter.lessons.flatMap((lesson) => [
      { id: lesson.id, type: "lesson" as const, title: lesson.title },
      { id: `${lesson.id}-ex`, type: "exercise" as const, title: "Exercise" },
    ])
  );
}

export function getPrevNext(
  items: NavItem[],
  lessonId: string,
  isExercise: boolean
) {
  const currentId = isExercise ? `${lessonId}-ex` : lessonId;
  const currentIndex = items.findIndex((item) => item.id === currentId);

  if (currentIndex === -1) return { prev: null, next: null };

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return { prev, next };
}

export function getPath(courseId: string, item: NavItem) {
  const base = item.type === "exercise" ? "exercise" : "lessons";
  const lessonId = item.id.replace("-ex", "");
  return `/${base}/${courseId}/${lessonId}`;
}

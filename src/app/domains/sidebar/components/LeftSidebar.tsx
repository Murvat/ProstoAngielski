"use client";

import SidebarShell from "./SidebarShell";
import SidebarToggle from "./SidebarToggle";
import Topic from "./Topic";
import Item from "./Item";
import type { Course } from "../features/types";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";

type Props = {
  course: Course;
  completedLessons?: Set<string>;
  completedExercises?: Set<string>;
};

export default function LeftSidebar({
  course,
  completedLessons = new Set(),
  completedExercises = new Set(),
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const { currentType, currentLessonId } = useMemo(() => {
    const parts = pathname?.split("/") || [];
    
    return { currentType: parts[1], currentLessonId: parts[3] };
  }, [pathname]);

  return (
    <SidebarShell isOpen={isOpen}>
      <SidebarToggle
        isOpen={isOpen}
        label={course.title}
        onToggle={() => setIsOpen((o) => !o)}
      />

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-4">
            {course.structure.chapters.map((chapter) => {
              const opened = openTopic === chapter.id;

              return (
                <Topic
                  key={chapter.id}
                  topic={{ id: chapter.id, title: chapter.title }}
                  isOpen={opened}
                  onToggle={() =>
                    setOpenTopic((prev) => (prev === chapter.id ? null : chapter.id))
                  }
                >
                  <ul className="space-y-2">
                    {chapter.lessons.map((lesson) => {
                      const lessonActive =
                        currentType === "lessons" && currentLessonId === lesson.id;
                      const exerciseActive =
                        currentType === "exercise" && currentLessonId === lesson.id;

                      return (
                        <div key={lesson.id} className="space-y-1">
                          <Item
                            item={lesson}
                            active={lessonActive}
                            onClick={() =>
                              router.push(`/lessons/${course.id}/${lesson.id}`)
                            }
                            completed={completedLessons.has(lesson.id)}
                          />
                          <div className="ml-6">
                            <Item
                              item={{
                                id: `${lesson.id}-ex`,
                                type: "exercise",
                                title: "Exercise",
                              }}
                              active={exerciseActive}
                              onClick={() =>
                                router.push(`/exercise/${course.id}/${lesson.id}`)
                              }
                              completed={completedExercises.has(lesson.id)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </ul>
                </Topic>
              );
            })}
          </nav>
        </div>
      )}
    </SidebarShell>
  );
}


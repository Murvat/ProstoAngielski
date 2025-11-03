"use client";

import SidebarShell from "./SidebarShell";
import SidebarToggle from "./SidebarToggle";
import Topic from "./Topic";
import Item from "./Item";
import type { CourseWithStructure } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { FREE_LESSON_LIMIT } from "@/app/domains/lessons/constants";
import { X } from "lucide-react";

type Props = {
  course: CourseWithStructure;
  completedLessons?: Set<string>;
  completedExercises?: Set<string>;
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

export default function LeftSidebar({
  course,
  completedLessons = new Set(),
  completedExercises = new Set(),
  hasFullAccess = false,
  isAccessLoading = false,
  onLockedLessonAttempt,
  variant = "desktop",
  className,
  onClose,
  onNavigate,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = variant === "desktop";
  const [isOpen, setIsOpen] = useState(true);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const { currentType, currentLessonId } = useMemo(() => {
    const parts = pathname?.split("/") || [];
    return { currentType: parts[1], currentLessonId: parts[3] };
  }, [pathname]);

  let lessonIndexCounter = 0;
  const gatingEnabled = !hasFullAccess && !isAccessLoading;

  useEffect(() => {
    if (!isDesktop) return;
    if (!isOpen) {
      setOpenTopic(null);
    }
  }, [isDesktop, isOpen]);

  useEffect(() => {
    if (!isDesktop) return;
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--lesson-sidebar-width", isOpen ? "20rem" : "4rem");
    return () => {
      root.style.setProperty("--lesson-sidebar-width", "20rem");
    };
  }, [isDesktop, isOpen]);

  const handleToggle = () => {
    if (!isDesktop) return;
    setIsOpen((open) => !open);
  };

  const handleNavigate = () => {
    if (!isDesktop) {
      onNavigate?.();
      onClose?.();
    }
  };

  return (
    <SidebarShell isOpen={isOpen} variant={variant} className={className}>
      {isDesktop ? (
        <div className="bg-white/80 px-3 pb-3 pt-4 backdrop-blur">
          <SidebarToggle isOpen={isOpen} label={course.title} onToggle={handleToggle} />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 border-b border-emerald-100 bg-white/90 px-4 py-3">
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-emerald-700">Nawigacja w kursie</span>
            <span className="text-xs text-emerald-500/80">{course.title}</span>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 text-emerald-600 transition hover:border-emerald-200 hover:bg-emerald-50"
            aria-label="Zamknij nawigację"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {(isDesktop ? isOpen : true) && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          <nav className="space-y-1">
            {course.structure.chapters.map((chapter) => {
              const opened = openTopic === chapter.id;

              return (
                <Topic
                  key={chapter.id}
                  title={chapter.title}
                  isOpen={opened}
                  onToggle={() => setOpenTopic((prev) => (prev === chapter.id ? null : chapter.id))}
                >
                  <ul className="space-y-2 py-2">
                    {chapter.lessons.map((lesson) => {
                      const isLesson = lesson.type === "lesson";
                      if (isLesson) lessonIndexCounter += 1;

                      const lessonOrder = lessonIndexCounter;
                      const isLessonLocked = gatingEnabled && isLesson && lessonOrder > FREE_LESSON_LIMIT;

                      const lessonActive = currentType === "lessons" && currentLessonId === lesson.id;
                      const exerciseActive = currentType === "exercise" && currentLessonId === lesson.id;

                      const handleLockedAttempt = (isExercise: boolean) =>
                        onLockedLessonAttempt?.({
                          lessonId: lesson.id,
                          lessonOrder,
                          isExercise,
                        });

                      return (
                        <li key={lesson.id} className="space-y-1">
                          <Item
                            item={lesson}
                            active={lessonActive}
                            locked={isLessonLocked}
                            onClick={() => {
                              if (isLessonLocked) {
                                handleLockedAttempt(false);
                                return;
                              }
                              router.push(`/lessons/${course.id}/${lesson.id}`);
                              handleNavigate();
                            }}
                            completed={completedLessons.has(lesson.id)}
                          />

                          <div className="ml-6">
                            <Item
                              item={{
                                id: `${lesson.id}-ex`,
                                type: "exercise",
                                title: "Ćwiczenie",
                              }}
                              active={exerciseActive}
                              locked={isLessonLocked}
                              onClick={() => {
                                if (isLessonLocked) {
                                  handleLockedAttempt(true);
                                  return;
                                }
                                router.push(`/exercise/${course.id}/${lesson.id}`);
                                handleNavigate();
                              }}
                              completed={completedExercises.has(lesson.id)}
                            />
                          </div>
                        </li>
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

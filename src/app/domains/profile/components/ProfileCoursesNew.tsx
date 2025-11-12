"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import type { Course } from "@/types";
import { useLessonRedirect } from "../features/useLessonRedirect";

type ButtonState = { label: string; lessonId: string | null };

interface ProfileCoursesNewProps {
  newCourses: Course[];
  getButtonState: (course: Course) => ButtonState;
}

export const ProfileCoursesNew = ({
  newCourses,
  getButtonState,
}: ProfileCoursesNewProps) => {
  const { goToLesson } = useLessonRedirect();

  if (newCourses.length === 0) {
    return (
      <p className="text-gray-500 text-center bg-gray-50 py-6 rounded-lg border border-gray-100">
        Obecnie nie ma dostepnych kursow.
      </p>
    );
  }

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="space-y-6"
    >
      {newCourses.map((course) => {
        const accessState = getButtonState(course);

        return (
          <motion.li
            key={course.id}
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col gap-5 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-md transition-all duration-300 hover:border-green-200 hover:shadow-xl"
          >
            <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-emerald-200">
              Darmowy dostęp
            </span>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-green-800">{course.title}</h3>

              {course.short_description && (
                <p className="text-sm leading-relaxed text-gray-600">
                  {course.short_description}
                </p>
              )}

              {course.level && (
                <span className="mt-1 inline-block self-start rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-800">
                  {course.level}
                </span>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                if (accessState.lessonId) {
                  goToLesson(course.id, accessState.lessonId);
                }
              }}
              disabled={!accessState.lessonId}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlayCircle className="h-4 w-4" />
              {accessState.lessonId ? "Rozpocznij kurs" : accessState.label}
            </motion.button>

            <p className="text-xs text-gray-500">
              Wszystkie kursy są teraz w pełni bezpłatne — wystarczy kliknąć, aby zacząć.
            </p>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

"use client";

import { motion } from "framer-motion";
import { useLessonRedirect } from "../features/useLessonRedirect";
import { Course } from "../features/types";
import { PlayCircle } from "lucide-react";

interface ProfileCoursesOwnedProps {
  ownedCourses: Course[];
  loading: string | null;
  getButtonState: (course: Course) => { label: string; lessonId: string | null };
}

export const ProfileCoursesOwned = ({
  ownedCourses,
  loading,
  getButtonState,
}: ProfileCoursesOwnedProps) => {
  const { goToLesson } = useLessonRedirect();

  if (ownedCourses.length === 0)
    return (
      <p className="text-gray-500 text-center bg-gray-50 py-6 rounded-lg border border-gray-100">
        Nie masz jeszcze żadnych kursów.
      </p>
    );

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
      className="space-y-5"
    >
      {ownedCourses.map((course, index) => {
        const { label, lessonId } = getButtonState(course);
        const isLoading = loading === `start-${course.id}`;

        return (
          <motion.li
            key={course.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 shadow-md 
                       hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Left side: Course Info */}
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-lg text-green-800">{course.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {course.title || "Rozpocznij swoją naukę już teraz!"}
              </p>
              <span className="inline-block bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full mt-2 self-start">
                {course.level}
              </span>
            </div>

            {/* Right side: Action Button */}
            {lessonId && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => goToLesson(course.id, lessonId)}
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-semibold text-white shadow-md transition-all duration-200 
                  ${
                    isLoading
                      ? "bg-gradient-to-r from-green-300 to-green-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg active:scale-95"
                  }`}
              >
                {isLoading ? (
                  "Ładowanie..."
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" /> {label}
                  </>
                )}
              </motion.button>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

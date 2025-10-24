"use client";

import { motion } from "framer-motion";
// import { useMemo } from "react";
import { PlayCircle, ShoppingCart } from "lucide-react";
import type { Course, Purchase } from "@/types";
import { useBuyCourse } from "../features/useBuyCourse";
import { useLessonRedirect } from "../features/useLessonRedirect";

type ButtonState = { label: string; lessonId: string | null };

interface ProfileCoursesNewProps {
  newCourses: Course[];
  purchases: Purchase[];
  paidCourseIds: Set<string>;
  hasActiveSubscription: boolean;
  getButtonState: (course: Course) => ButtonState;
}

// const resolvePurchaseCourseId = (purchase: Purchase) => {
//   if (typeof purchase.course === "string") return purchase.course;
//   return purchase.course?.id ?? null;
// };

export const ProfileCoursesNew = ({
  newCourses,
  paidCourseIds,
  getButtonState,
}: ProfileCoursesNewProps) => {
  const { buyCourse, loading } = useBuyCourse();
  const { goToLesson } = useLessonRedirect();

  // const purchasesByCourse = useMemo(() => {
  //   const map = new Map<string, Purchase>();
  //   for (const purchase of purchases) {
  //     const id = resolvePurchaseCourseId(purchase);
  //     if (id) {
  //       map.set(id, purchase);
  //     }
  //   }
  //   return map;
  // }, [purchases]);

  if (newCourses.length === 0) {
    return (
      <p className="text-gray-500 text-center bg-gray-50 py-6 rounded-lg border border-gray-100">
        Obecnie nie ma dostępnych kursów.
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
        const isPurchased = paidCourseIds.has(course.id);
        const accessState = getButtonState(course);
        const isBuying = loading === `buy-${course.id}`;

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
            {/* Status badge */}
            {isPurchased && (
              <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-emerald-200">
                Opłacono
              </span>
            )}

            {/* Kurs məlumatı */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-green-800">
                {course.title}
              </h3>

              {course.short_description && (
                <p className="text-sm leading-relaxed text-gray-600">
                  {course.short_description}
                </p>
              )}

              <span className="mt-1 inline-block self-start rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-800">
                {course.level}
              </span>
            </div>

            {/* Yuxarıda – kursa daxil ol */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                if (accessState.lessonId) {
                  goToLesson(course.id, accessState.lessonId);
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              <PlayCircle className="h-4 w-4" />
              {isPurchased ? "Rozpocznij kurs" : "Wypróbuj za darmo"}
            </motion.button>

            {/* Aşağıda – almaq üçün */}
            {!isPurchased && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => buyCourse(course.id)}
                disabled={isBuying}
                className={`mt-2 flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
                  isBuying
                    ? "cursor-not-allowed bg-gray-300 text-gray-100"
                    : "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm hover:shadow-md"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {isBuying ? "Przetwarzanie..." : "Kup kurs"}
              </motion.button>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

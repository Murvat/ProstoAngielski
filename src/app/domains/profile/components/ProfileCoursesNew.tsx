"use client";

import { motion } from "framer-motion";
import { useBuyCourse } from "../features/useBuyCourse";
import { Course, Purchase } from "../features/types";
import { ShoppingCart } from "lucide-react";

interface ProfileCoursesNewProps {
  newCourses: Course[];
  purchases: Purchase[];
  loading: string | null;
}

export const ProfileCoursesNew = ({
  newCourses,
  purchases,
  loading,
}: ProfileCoursesNewProps) => {
  const { buyCourse } = useBuyCourse();

  if (newCourses.length === 0)
    return (
      <p className="text-gray-500 text-center bg-gray-50 py-6 rounded-lg border border-gray-100">
        Brak dostępnych kursów.
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
      className="space-y-6"
    >
      {newCourses.map((course) => {
        const purchase = purchases.find((p) => p.course === course.id);
        const isBuying = loading === `buy-${course.id}`;

        let buttonLabel = `Kup za ${course.price / 100} zł`;
        if (purchase?.payment_status === "failed") buttonLabel = "Spróbuj ponownie";

        return (
          <motion.li
            key={course.id}
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 
                       shadow-md hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col sm:flex-row 
                       justify-between gap-5"
          >
            {/* Left side — Course info */}
            <div className="flex flex-col gap-1 max-w-lg">
              <h3 className="font-bold text-lg text-green-800">{course.title}</h3>

              {course.short_description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.short_description}
                </p>
              )}

              <span className="inline-block bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full mt-2 self-start">
                {course.level}
              </span>

              <p className="text-[11px] text-gray-400 mt-3 leading-tight max-w-sm">
                Kupując kurs, wyrażasz zgodę na natychmiastowe rozpoczęcie świadczenia usługi i
                przyjmujesz do wiadomości, że po uruchomieniu kursu tracisz prawo do odstąpienia od
                umowy (brak zwrotu).
              </p>
            </div>

            {/* Right side — Buy button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => buyCourse(course.id)}
              disabled={isBuying}
              className={`flex items-center justify-center gap-1
    px-2 py-[3px] text-[11px] font-medium rounded-md
    transition-all duration-200
    self-start   // 🧩 BU VACİBDİR
    ${isBuying
                  ? "bg-green-300 text-white cursor-not-allowed opacity-70"
                  : "bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
                }`}
            >
              {isBuying ? (
                "..."
              ) : (
                <>
                  <ShoppingCart className="w-[12px] h-[12px]" />
                  {buttonLabel}
                </>
              )}
            </motion.button>

          </motion.li>
        );
      })}
    </motion.ul>
  );
};

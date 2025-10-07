"use client";
import { useBuyCourse } from "../features/useBuyCourse";
import { Course, Purchase } from "../features/types";

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
    return <p className="text-gray-500">Brak dostępnych kursów.</p>;

  return (
    <ul className="space-y-4">
      {newCourses.map((course) => {
        const purchase = purchases.find((p) => p.course === course.id);
        const isBuying = loading === `buy-${course.id}`;

        let buttonLabel = `Kup za ${course.price / 100} zł`;
        if (purchase?.payment_status === "failed")
          buttonLabel = "Spróbuj ponownie";

        return (
          <li
            key={course.id}
            className="p-5 rounded-xl bg-green-50 border border-green-100 shadow-sm flex justify-between items-center
                       hover:shadow-md hover:bg-green-100 transition-all duration-200 cursor-pointer"
          >
            <div className="flex flex-col">
              <p className="font-semibold text-green-800 text-base">
                {course.title}
              </p>
              <span className="inline-block bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full mt-1">
                {course.level}
              </span>
              {course.short_description && (
                <p className="text-sm text-gray-600 mt-1">
                  {course.short_description}
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-2 leading-tight max-w-xs">
                Kupując kurs, wyrażasz zgodę na natychmiastowe rozpoczęcie
                świadczenia usługi i przyjmujesz do wiadomości, że po
                uruchomieniu kursu tracisz prawo do odstąpienia od umowy
                (brak zwrotu).
              </p>
            </div>

            <button
              onClick={() => buyCourse(course.id)}
              disabled={isBuying}
              className="bg-gradient-to-r from-green-500 to-green-600 
                         text-white font-semibold px-6 py-2 
                         rounded-xl shadow-md 
                         hover:from-green-600 hover:to-green-700 hover:shadow-lg 
                         disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed
                         active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {isBuying ? "Przetwarzanie..." : buttonLabel}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

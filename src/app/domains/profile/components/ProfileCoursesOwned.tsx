"use client";
import { useLessonRedirect } from "../features/useLessonRedirect";
import { Course } from "../features/types";

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
    return <p className="text-gray-500">Nie masz jeszcze żadnych kursów.</p>;

  return (
    <ul className="space-y-4">
      {ownedCourses.map((course) => {
        const { label, lessonId } = getButtonState(course);
        const isLoading = loading === `start-${course.id}`;

        return (
          <li
            key={course.id}
            className="p-5 rounded-xl bg-green-50 border border-green-100 shadow-sm 
                       flex justify-between items-center hover:bg-green-100 hover:shadow-md 
                       transition-all duration-200 cursor-pointer"
          >
            <div>
              <p className="font-semibold text-green-800 text-base">
                {course.title}
              </p>
              <span className="inline-block bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full mt-1">
                {course.level}
              </span>
            </div>

            {lessonId && (
              <button
                onClick={() => goToLesson(course.id, lessonId)}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 
                           text-white font-semibold px-6 py-2 
                           rounded-xl shadow-md 
                           hover:from-green-600 hover:to-green-700 hover:shadow-lg 
                           disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed
                           active:scale-95 transition-all duration-200 cursor-pointer"
              >
                {isLoading ? "Ładowanie..." : label}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

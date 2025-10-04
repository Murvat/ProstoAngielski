"use client";
import { useLessonRedirect } from "../features/useLessonRedirect";
import { Course, Progress } from "../features/types";

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

  if (ownedCourses.length === 0) {
    return <p className="text-gray-500">Nie masz jeszcze żadnych kursów.</p>;
  }

  return (
    <ul className="space-y-4">
      {ownedCourses.map((course) => {
        const { label, lessonId } = getButtonState(course);
        const isLoading = loading === `start-${course.id}`;

        return (
          <li
            key={course.id}
            className="p-4 rounded-lg shadow-sm bg-[#E8F5E9] flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{course.title}</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                {course.level}
              </span>
            </div>
            {lessonId && (
              <button
                onClick={() => goToLesson(course.id, lessonId)}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition"
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

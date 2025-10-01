"use client";

import { useState } from "react";
import { useBuyCourse } from "../features/useBuyCourse";
import { useLessonRedirect } from "../features/useLessonRedirect";
import { useCourseProgress } from "../features/useCourseProgress";

type Course = {
  id: string;
  title: string;
  level: string;
  price: number;
  short_description?: string;
  first_lesson_id?: string;
};

type Progress = {
  id: string;
  user_id: string;
  course: string;
  lesson_id: string;
  completed_exercises: boolean;
  updated_at: string;
};

type Purchase = {
  id: string;
  course: string;
  payment_status: "paid" | "failed"; // ❌ usunięte "unpaid"
};

type User = {
  id: string;
  email?: string;
};

type Tab = "kursy" | "dane" | "ustalenia" | "platnosci" | "mobilna";

export default function ProfileClient({
  user,
  allCourses = [],
  purchases = [],
  progress = [],
}: {
  user: User;
  allCourses?: Course[];
  purchases?: Purchase[];
  progress?: Progress[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("kursy");

  // hooks
  const { buyCourse, loading } = useBuyCourse();
  const { goToLesson } = useLessonRedirect();
  const { getButtonState } = useCourseProgress(progress);

  // Split courses into owned vs new
  const ownedCourses = allCourses.filter((course) =>
    purchases.some((p) => p.course === course.id && p.payment_status === "paid")
  );

  const newCourses = allCourses.filter(
    (course) =>
      !purchases.some(
        (p) => p.course === course.id && p.payment_status === "paid"
      )
  );

  const tabConfig: { key: Tab; label: string }[] = [
    { key: "kursy", label: "Kursy" },
    { key: "dane", label: "Dane osobiste" },
    { key: "ustalenia", label: "Ustalenia" },
    { key: "platnosci", label: "Płatności" },
    { key: "mobilna", label: "Mobilna appka" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "kursy":
        return (
          <div className="space-y-10">
            {/* Moje kursy */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Moje kursy</h2>
              {ownedCourses.length === 0 ? (
                <p className="text-gray-500">Nie masz jeszcze żadnych kursów.</p>
              ) : (
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
              )}
            </div>

            {/* Nowe kursy */}
<div>
  <h2 className="text-lg font-semibold mb-4">Nowe kursy</h2>
  {newCourses.length === 0 ? (
    <p className="text-gray-500">Brak dostępnych kursów.</p>
  ) : (
    <ul className="space-y-4">
      {newCourses.map((course) => {
        const purchase = purchases.find((p) => p.course === course.id);
        const isBuying = loading === `buy-${course.id}`;

        let buttonLabel = `Kup za ${course.price / 100} zł`;
        if (purchase?.payment_status === "failed") {
          buttonLabel = "Spróbuj ponownie";
        }

        return (
          <li
            key={course.id}
            className="p-4 rounded-lg bg-[#E8F5E9] shadow-sm flex justify-between items-center"
          >
            <div className="flex flex-col">
              <p className="font-semibold">{course.title}</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                {course.level}
              </span>
              {course.short_description && (
                <p className="text-sm text-gray-500 mt-1">
                  {course.short_description}
                </p>
              )}
            </div>
            <button
              onClick={() => buyCourse(course.id)}
              disabled={isBuying}
              className="bg-gradient-to-r from-green-500 to-green-600 
                       text-white font-semibold px-6 py-2 
                       rounded-xl shadow-md 
                       hover:from-green-600 hover:to-green-700 hover:shadow-lg 
                       disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed
                       active:scale-95 transition-all duration-200"
            >
              {isBuying ? "Przetwarzanie..." : buttonLabel}
            </button>
          </li>
        );
      })}
    </ul>
  )}
</div>
          </div>
        );

      case "dane":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Dane osobiste</h2>
            <p className="text-gray-700">Email: {user.email}</p>
            <p className="text-gray-700 mt-2">ID użytkownika: {user.id}</p>
          </div>
        );

      case "ustalenia":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Ustalenia</h2>
            <p className="text-gray-500">Sekcja w przygotowaniu.</p>
          </div>
        );

      case "platnosci":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Płatności</h2>
            <p className="text-gray-500">
              Tutaj pojawi się historia Twoich płatności.
            </p>
          </div>
        );

      case "mobilna":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Mobilna appka</h2>
            <p className="text-gray-500">
              Nasza aplikacja mobilna jest w przygotowaniu 🚀. Już wkrótce będzie
              dostępna do pobrania na iOS i Android.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row border-b mb-6">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-center px-4 py-2 text-sm sm:text-base font-medium cursor-pointer transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-xl p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

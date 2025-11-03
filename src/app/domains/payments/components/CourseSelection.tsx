"use client";

import CourseCard from "./CourseCard";
import { useCourse } from "../../preview/features/useCourse";

type Props = {
  course: string;
  setCourse: (v: string) => void;
};

export default function CourseSelection({ course, setCourse }: Props) {
  const { courses, loading, error } = useCourse();

  if (loading) {
    return (
      <p className="text-gray-600 text-sm animate-pulse">
        Ladowanie kursow...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 font-medium">
        Wystapil blad: {error}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer">
      {courses.map((c) => {
        const description = c.short_description ?? "Brak opisu kursu";
        const level = c.level ?? "Wszystkie poziomy";
        const duration = c.duration ?? "Dowolna dlugosc";
        const priceLabel =
          typeof c.price === "number" && c.price > 0
            ? `${(c.price / 100).toFixed(2)} zl`
            : "Za darmo";

        return (
          <CourseCard
            key={c.id}
            id={c.id}
            title={c.title}
            description={description}
            level={level}
            duration={duration}
            price={priceLabel}
            selected={course === c.id}
            onSelect={setCourse}
          />
        );
      })}
    </div>
  );
}

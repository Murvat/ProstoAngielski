"use client";

import CourseCard from "./CourseCard";
import { useCourse } from "../../preview/features/useCourse"; 

type Props = {
  course: string;
  setCourse: (v: string) => void;
};

export default function CourseSelection({ course, setCourse }: Props) {
  const { courses, loading, error } = useCourse();

  if (loading) return <p>Ładowanie kursów...</p>;
  if (error) return <p className="text-red-600">Błąd: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((c) => (
        <CourseCard
          key={c.id}
          id={c.id}
          title={c.title}
          description={c.short_description}
          level={c.level}
          duration={c.duration}
          price={`${c.price / 100} zł`}
          selected={course === c.id}
          onSelect={setCourse}
        />
      ))}
    </div>
  );
}

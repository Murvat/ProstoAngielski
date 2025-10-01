// src/app/domains/lesson/components/LessonExerciseLayout.tsx
"use client";

import SidebarContainer from "@/app/domains/sidebar/containers/SidebarContainer";
import TocContainer from "@/app/domains/toc/containers/TocContainer";
import NavbarContainer from "../../navbar/containers/NavbarContainer";
import Footer from "../../footer/components/Footer";
import { buildNavItems, getPrevNext, getPath } from "../hooks/navigation";

import { usePathname } from "next/navigation";
import { useCourse } from "../hooks/useCourse";
import { useProgress } from "../hooks/useProgress";
import { User } from "@supabase/supabase-js";

type Props = {
  user: User;
  courseId: string;
  lessonId: string;
  children: React.ReactNode;
  showToc?: boolean;
  progress?: Progress[];
};

type Progress = {
  id: string;
  user_id: string;
  course: string;
  lesson_id: string;
  completed_exercises: boolean;
  updated_at: string;
};

export default function LessonExerciseLayout({
  user,
  courseId,
  lessonId,
  children,
  showToc = true,
  progress = [],
}: Props) {
  const pathname = usePathname();
  const isExercise = pathname?.startsWith("/exercise/");

  // 1. Fetch course
  const { course, loading } = useCourse(courseId);

  // 2. Build navigation from course.structure
  const items = course ? buildNavItems(course) : [];
  const { prev, next } = getPrevNext(items, lessonId, isExercise);

  // 3. Progress handler
  const { isFinished, handleNext } = useProgress(
    courseId,
    lessonId,
    isExercise,
    () => {
      if (next) {
        window.location.href = getPath(courseId, next);
      }
    }
  );

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 h-16 bg-white">
        <NavbarContainer initialUser={user} />
      </header>

      {/* Layout row */}
      <div className="flex w-full px-0 py-8">
        {/* LEFT SIDEBAR */}
        <aside className="fixed top-16 bottom-0 left-0 hidden lg:block w-80 bg-gray-50 overflow-y-auto">
{course ? (
  <SidebarContainer course={course} progress={progress} />
) : (
  <div className="p-4">Loading sidebar…</div>
)}        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col pb-16 px-6 bg-white lg:ml-80 lg:mr-72">
          {children}
        </div>

        {/* RIGHT SIDEBAR (TOC only if enabled) */}
        {showToc && (
          <aside className="fixed top-16 bottom-0 right-0 hidden lg:block w-72 bg-gray-50 overflow-y-auto">
            <TocContainer />
          </aside>
        )}
      </div>

      {/* FOOTER */}
      {!loading && course && (
<Footer
  className="
    absolute bottom-0
    left-0 right-0            /* default: full width */
    lg:left-80 lg:right-72    /* adapt when sidebars visible */
  "
  onPrev={() => prev && (window.location.href = getPath(courseId, prev))}
  onNext={handleNext}
  prevDisabled={!prev}
  nextDisabled={!next}
  prevLabel="Previous"
          nextLabel={isFinished ? "Next" : "Finish"}
           hideFinish={isFinished} 
/>      )}
    </main>
  );
}

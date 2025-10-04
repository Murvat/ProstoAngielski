"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

import SidebarContainer from "@/app/domains/sidebar/containers/SidebarContainer";
import TocContainer from "@/app/domains/toc/containers/TocContainer";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import Footer from "@/app/domains/footer/components/Footer";

import { useCourse } from "../hooks/useCourse";
import { useProgress } from "../hooks/useProgress";
import { buildNavItems, getPrevNext, getPath } from "../hooks/navigation";

type Progress = {
  id: string;
  user_id: string;
  course: string;
  lesson_id: string;
  completed_exercises: boolean;
  updated_at: string;
};

type Props = {
  children: React.ReactNode;
  showToc?: boolean;
};

export default function LessonExerciseLayout({ children, showToc = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;
  const isExercise = pathname?.startsWith("/exercise/");

  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [reloadProgress, setReloadProgress] = useState(false); // ✅ added

  // ✅ load user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" });
        if (!res.ok) throw new Error("Unauthorized");
        const { user } = await res.json();
        setUser(user);
      } catch (err) {
        console.error("❌ Failed to fetch user", err);
      }
    }
    loadUser();
  }, []);

  // ✅ load progress (reactive)
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/progress/all", { cache: "no-store" });
        if (!res.ok) throw new Error("Unauthorized");
        const { progress } = await res.json();
        setProgress(progress || []);
      } catch (err) {
        console.error("❌ Progress fetch error:", err);
      } finally {
        setLoadingProgress(false);
      }
    }
    loadProgress();
  }, [reloadProgress]); // ✅ re-fetch when toggled

  // ✅ course + nav logic
  const { course, loading } = useCourse(courseId);
  const items = course ? buildNavItems(course) : [];
  const { prev, next } = getPrevNext(items, lessonId, isExercise);

  // ✅ progress handler with sidebar reload
  const { isFinished, handleNext } = useProgress(
    courseId,
    lessonId,
    isExercise,
    async () => {
      // refresh sidebar before moving next
      setReloadProgress((v) => !v);
      await new Promise((r) => setTimeout(r, 150));
      if (next) router.push(getPath(courseId, next));
    }
  );

  if (!user || !course) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-500">
        Ładowanie kursu...
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 🧭 Navbar */}
      <header className="sticky top-0 z-50 h-16 bg-white border-b">
        <NavbarContainer initialUser={user} />
      </header>

      {/* 🧩 Page Layout */}
      <div className="flex w-full px-0 py-8">
        {/* 📚 Left Sidebar */}
        <aside className="fixed top-16 bottom-0 left-0 hidden lg:block w-80 bg-gray-50 overflow-y-auto">
          {!loadingProgress ? (
            <SidebarContainer course={course} progress={progress} />
          ) : (
            <div className="p-4 text-gray-500">Ładowanie kursu...</div>
          )}
        </aside>

        {/* 📝 Main Content */}
        <section className="flex-1 min-w-0 flex flex-col pb-16 px-6 bg-white lg:ml-80 lg:mr-72">
          {children}
        </section>

        {/* 📖 TOC */}
        {showToc && (
          <aside className="fixed top-16 bottom-0 right-0 hidden lg:block w-72 bg-gray-50 overflow-y-auto">
            <TocContainer />
          </aside>
        )}
      </div>

      {/* 🦶 Footer */}
{!loading && (
  <Footer
    className="absolute bottom-0 left-0 right-0 lg:left-80 lg:right-72"
    onPrev={() => prev && router.push(getPath(courseId, prev))}
    onNext={() =>
      handleNext(async () => {
        // ✅ trigger sidebar progress reload
        setReloadProgress((v) => !v);

        // ✅ small wait so progress saves first
        await new Promise((r) => setTimeout(r, 150));

        // ✅ then navigate forward
        if (next) router.push(getPath(courseId, next));
      })
    }
    prevDisabled={!prev}
    nextDisabled={!next}
    prevLabel="Previous"
    nextLabel={isFinished ? "Next" : "Finish"}
    hideFinish={isFinished}
  />
)}    </main>
  );
}

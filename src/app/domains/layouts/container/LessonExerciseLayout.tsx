"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import type { Progress } from "@/types";
import SidebarContainer from "@/app/domains/sidebar/containers/SidebarContainer";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import Footer from "@/app/domains/footer/components/Footer";
import { useCourse } from "../hooks/useCourse";
import { useProgress } from "../hooks/useProgress";
import { buildNavItems, getPrevNext, getPath } from "../hooks/navigation";
import ChatbotSidebar from "../../chatbot/Chatbot";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { getLessonHeading } from "@/lib/supabase/queries";

type Props = {
  children: React.ReactNode;
};

export default function LessonExerciseLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;
  const isExercise = pathname?.startsWith("/exercise/");

  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [reloadProgress, setReloadProgress] = useState(false);
  const [lessonHeading, setLessonHeading] = useState("");

  useEffect(() => {
    if (!courseId || !lessonId) return;
    const orderIndex = Number(lessonId);
    if (Number.isNaN(orderIndex)) return;

    const fetchHeading = async () => {
      const { data, error } = await getLessonHeading(
        supabase,
        courseId,
        orderIndex
      );

      if (error) {
        console.error("Failed to fetch lesson heading:", error.message);
        return;
      }

      setLessonHeading(data ?? "");
    };

    fetchHeading();
  }, [courseId, lessonId]);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" });
        if (!res.ok) throw new Error("Unauthorized");
        const { user } = await res.json();
        setUser(user);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/progress/all", { cache: "no-store" });
        if (!res.ok) throw new Error("Unauthorized");
        const { progress } = await res.json();
        setProgress(progress || []);
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoadingProgress(false);
      }
    }

    loadProgress();
  }, [reloadProgress]);

  const { course, loading } = useCourse(courseId);
  const items = course ? buildNavItems(course) : [];
  const { prev, next } = getPrevNext(items, lessonId, isExercise);
  const { isFinished, handleNext } = useProgress(courseId, lessonId, isExercise);

  if (!user || !course) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-500">
        Ladowanie kursu...
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 h-16 bg-white border-b">
        <NavbarContainer initialUser={user} />
      </header>

      <div className="flex w-full">
        <aside className="fixed top-16 bottom-0 left-0 hidden lg:block w-80 bg-gray-50 overflow-y-auto hover:shadow-md transition-shadow z-40">
          {!loadingProgress ? (
            <SidebarContainer course={course} progress={progress} />
          ) : (
            <div className="p-4 text-gray-500">Ladowanie kursu...</div>
          )}
        </aside>

        <section
          id="htmlContent"
          className="flex-1 min-w-0 flex flex-col pb-16 px-6 bg-white lg:ml-80 md:mr-72 lg:mr-80 xl:mr-96"
        >
          {children}
        </section>

        <aside className="fixed top-16 bottom-0 right-0 hidden md:block w-72 lg:w-80 xl:w-96 bg-gray-50 dark:bg-zinc-900 overflow-y-auto hover:shadow-md transition-all duration-300 z-40">
          <ChatbotSidebar course={courseId} topic={lessonHeading} />
        </aside>
      </div>

      {!loading && (
        <Footer
          className="absolute bottom-0 left-0 right-0 lg:left-80 md:right-72 lg:right-80 xl:right-96"
          onPrev={() => prev && router.push(getPath(courseId, prev))}
          onNext={() =>
            handleNext(async () => {
              setReloadProgress((value) => !value);
              await new Promise((resolve) => setTimeout(resolve, 150));
              if (next) router.push(getPath(courseId, next));
            })
          }
          prevDisabled={!prev}
          nextDisabled={!next}
          prevLabel="Wstecz"
          nextLabel={isFinished ? "Dalej" : "Zakoncz"}
          hideFinish={isFinished}
        />
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import type { Progress } from "../features/types";
import SidebarContainer from "@/app/domains/sidebar/containers/SidebarContainer";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import Footer from "@/app/domains/footer/components/Footer";

import { useCourse } from "../hooks/useCourse";
import { useProgress } from "../hooks/useProgress";
import { buildNavItems, getPrevNext, getPath } from "../hooks/navigation";
import ChatbotSidebar from "../../chatbot/Chatbot";
import { supabase } from "@/lib/supabase/client/supabaseClient";


type Props = {
  children: React.ReactNode;
};

export default function LessonExerciseLayout({
  children,
}: Props) {

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

  const [lessonHeading, setLessonHeading] = useState<string>("");

  // ✅ Fetch heading directly from Supabase
  useEffect(() => {
    if (!courseId || !lessonId) return;

    const fetchHeading = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("heading")
        .eq("course_id", courseId)
        .eq("order_index", Number(lessonId))
        .single();

      if (error) {
        console.error("❌ Błąd pobierania heading:", error.message);
      } else if (data?.heading) {
        setLessonHeading(data.heading);
        console.log("✅ Heading loaded:", data.heading);
      }
    };

    fetchHeading();
  }, [courseId, lessonId]);
  // 🔹 Pobierz użytkownika
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" });
        if (!res.ok) throw new Error("Unauthorized");
        const { user } = await res.json();
        setUser(user);
      } catch (err) {
        console.error("❌ Błąd pobierania użytkownika:", err);
      }
    }
    loadUser();
  }, []);

  // 🔹 Pobierz postęp
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/progress/all", { cache: "no-store" });
        if (!res.ok) throw new Error("Unauthorized");
        const { progress } = await res.json();
        setProgress(progress || []);
      } catch (err) {
        console.error("❌ Błąd pobierania postępu:", err);
      } finally {
        setLoadingProgress(false);
      }
    }
    loadProgress();
  }, [reloadProgress]);

  // 🔹 Kurs i nawigacja
  const { course, loading } = useCourse(courseId);
  const items = course ? buildNavItems(course) : [];
  const { prev, next } = getPrevNext(items, lessonId, isExercise);

  // 🔹 Obsługa postępu
  const { isFinished, handleNext } = useProgress(courseId, lessonId, isExercise);

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

    {/*  Układ strony */}
    <div className="flex w-full">
      {/*  Lewy pasek boczny */}
      <aside className="fixed top-16 bottom-0 left-0 hidden lg:block w-80 bg-gray-50 overflow-y-auto hover:shadow-md transition-shadow z-40">
        {!loadingProgress ? (
          <SidebarContainer course={course} progress={progress} />
        ) : (
          <div className="p-4 text-gray-500">Ładowanie kursu...</div>
        )}
      </aside>

      {/*  Główna zawartość */}
      <section
        id="htmlContent"
        className="
          flex-1 min-w-0 flex flex-col pb-16 px-6 bg-white
          lg:ml-80           /* space for left sidebar */
          md:mr-72 lg:mr-80 xl:mr-96 /* space for right MurAi */
        "
      >
        {children}
      </section>

      {/* 💬 Prawy pasek MurAi */}
      <aside
        className="fixed top-16 bottom-0 right-0 hidden md:block w-72 lg:w-80 xl:w-96 bg-gray-50 dark:bg-zinc-900 overflow-y-auto hover:shadow-md transition-all duration-300 z-40"
      >
        <ChatbotSidebar course={courseId} topic={lessonHeading } />
      </aside>
    </div>

    {/* 🦶 Stopka */}
    {!loading && (
      <Footer
        className="
          absolute bottom-0 left-0 right-0
          lg:left-80 md:right-72 lg:right-80 xl:right-96
        "
        onPrev={() => prev && router.push(getPath(courseId, prev))}
        onNext={() =>
          handleNext(async () => {
            setReloadProgress((v) => !v);
            await new Promise((r) => setTimeout(r, 150));
            if (next) router.push(getPath(courseId, next));
          })
        }
        prevDisabled={!prev}
        nextDisabled={!next}
        prevLabel="Wstecz"
        nextLabel={isFinished ? "Dalej" : "Zakończ"}
        hideFinish={isFinished}
      />
    )}
  </main>
);
}

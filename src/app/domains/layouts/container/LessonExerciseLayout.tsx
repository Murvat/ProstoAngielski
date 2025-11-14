"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Purchase, Progress, Subscription } from "@/types";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import SidebarContainer from "@/app/domains/sidebar/containers/SidebarContainer";
import Footer from "@/app/domains/footer/components/Footer";
import ChatbotSidebar from "../../chatbot/Chatbot";
import { useCourse } from "../hooks/useCourse";
import { useProgress } from "../hooks/useProgress";
import { buildNavItems, getPrevNext, getPath } from "../hooks/navigation";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { getLessonHeading } from "@/lib/supabase/queries";
import { CourseAccessContext } from "@/app/domains/lessons/context/CourseAccessContext";
import { Menu, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProfileState = {
  user: User | null;
  purchases: Purchase[];
  subscriptions: Subscription[];
  progress: Progress[];
};

export default function LessonExerciseLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;
  const isExercise = pathname?.startsWith("/exercise/");

  const [loading, setLoading] = useState(true);
  const [lessonHeading, setLessonHeading] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);


  const floatingButtonOffset = "calc(env(safe-area-inset-bottom, 0px) + 6.75rem)";
  const overlayBottomPadding = "calc(env(safe-area-inset-bottom, 0px) + 2.5rem)";
  const [profile, setProfile] = useState<ProfileState>({
    user: null,
    purchases: [],
    subscriptions: [],
    progress: [],
  });

  const { course, loading: courseLoading } = useCourse(courseId);
  const { isFinished, handleNext } = useProgress(courseId, lessonId, isExercise);
  const { prev, next } = getPrevNext(course ? buildNavItems(course) : [], lessonId, isExercise);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) throw new Error("Profile fetch failed");
        const data = (await res.json()) as Partial<ProfileState>;
        setProfile({
          user: data.user ?? null,
          purchases: data.purchases ?? [],
          subscriptions: data.subscriptions ?? [],
          progress: data.progress ?? [],
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  useEffect(() => {
    if (!courseId || !lessonId) return;
    const idx = Number(lessonId);
    if (Number.isNaN(idx)) return;

    (async () => {
      try {
        const { data } = await getLessonHeading(supabase, courseId, idx);
        if (data) setLessonHeading(data);
      } catch (err) {
        console.error("Lesson heading error:", err);
      }
    })();
  }, [courseId, lessonId]);

  useEffect(() => {
    setMobileSidebarOpen(false);
    setMobileChatOpen(false);
  }, [pathname]);

  const accessContextValue = useMemo(
    () => ({
      hasFullAccess: true,
      accessLoading: false,
      freeLessonLimit: Infinity,
    }),
    []
  );

  if (loading || courseLoading) {
    return (
      <main className="flex flex-col items-center justify-center h-screen text-gray-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full mb-4"
        />
        <p>Ładowanie kursu...</p>
      </main>
    );
  }

  return (
    <CourseAccessContext.Provider value={accessContextValue}>
      <main className="flex flex-col min-h-screen bg-white">
        <header className="sticky top-0 z-50 h-16 bg-white border-b">
          <NavbarContainer initialUser={profile.user} />
        </header>

        {!mobileSidebarOpen && (
          <button
            type="button"
            disabled={!course}
            onClick={() => setMobileSidebarOpen(true)}
            className="fixed left-5 z-40 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white shadow-lg shadow-emerald-200/60 transition hover:from-emerald-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 md:hidden"
            style={{ bottom: floatingButtonOffset }}
            aria-label="Otwórz nawigację kursu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {!mobileChatOpen && (
          <button
            type="button"
            onClick={() => setMobileChatOpen(true)}
            className="fixed right-5 z-40 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white shadow-lg shadow-emerald-200/60 transition hover:from-emerald-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 md:hidden"
            style={{ bottom: floatingButtonOffset }}
            aria-label="Otwórz czat z MurAi"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        )}

        <AnimatePresence>
          {mobileSidebarOpen && course && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="relative z-10 h-full w-5/6 max-w-sm"
                style={{ paddingBottom: overlayBottomPadding }}
                onClick={(event) => event.stopPropagation()}
              >
                <SidebarContainer
                  course={course}
                  progress={profile.progress}
                  variant="mobile"
                  onClose={() => setMobileSidebarOpen(false)}
                  onNavigate={() => setMobileSidebarOpen(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {mobileChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex md:hidden"
              onClick={() => setMobileChatOpen(false)}
            >
              {/* Background overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />

              {/* Floating chat container */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="relative z-10 flex w-full items-end justify-center px-4"
                style={{ paddingBottom: overlayBottomPadding }}
                onClick={(event) => event.stopPropagation()}
              >
                <div
                  className="relative w-full max-w-md h-[80vh] rounded-3xl border border-emerald-100 bg-white shadow-2xl overflow-hidden"
                  style={{
                    marginBottom: "calc(env(safe-area-inset-bottom, 0px) + 6rem)",
                  }}
                >
                  <ChatbotSidebar
                    course={courseId}
                    topic={lessonHeading}
                    onCollapse={() => setMobileChatOpen(false)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        <div className="flex w-full">
          <aside
            className="fixed top-16 bottom-0 left-0 hidden overflow-y-auto bg-white/90 shadow-md lg:block z-40"
            style={{ width: "var(--lesson-sidebar-width)" }}
          >
            {course && (
              <SidebarContainer
                course={course}
                progress={profile.progress}
              />
            )}
          </aside>

          <section
            id="lessonContent"
            className="lesson-content-offset relative flex min-w-0 flex-1 flex-col bg-white px-4 pb-24 md:px-6 md:pb-16"
          >
            {children}
          </section>

          <aside className="lesson-chatbot-container fixed top-16 bottom-0 right-0 hidden md:flex flex-col overflow-hidden bg-white/90 shadow-md z-40">
            <ChatbotSidebar course={courseId} topic={lessonHeading} />
          </aside>
        </div>

        {/* Footer */}
        {!courseLoading && (
          <Footer
            className="lesson-footer-offset absolute bottom-0 left-0 right-0"
            onPrev={() => prev && router.push(getPath(courseId, prev))}
            onNext={() =>
              handleNext(async () => {
                await new Promise((r) => setTimeout(r, 150));
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
    </CourseAccessContext.Provider>
  );
}

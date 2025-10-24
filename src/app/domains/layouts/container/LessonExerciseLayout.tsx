"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { AppUser, Purchase, Progress, Subscription, Course, CourseWithStructure } from "@/types";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import SidebarContainer from "@/app/domains/sidebar/containers/SidebarContainer";
import Footer from "@/app/domains/footer/components/Footer";
import ChatbotSidebar from "../../chatbot/Chatbot";
import { useCourse } from "../hooks/useCourse";
import { useProgress } from "../hooks/useProgress";
import { buildNavItems, getPrevNext, getPath } from "../hooks/navigation";
import { useBuyCourse } from "../../profile/features/useBuyCourse";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { getLessonHeading } from "@/lib/supabase/queries";
import { CourseAccessContext } from "@/app/domains/lessons/context/CourseAccessContext";
import { Lock, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FREE_LESSON_LIMIT } from "../../lessons/constants";
import { User } from "@supabase/supabase-js";
const TRIAL_LIMIT = FREE_LESSON_LIMIT;

export default function LessonExerciseLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;
  const isExercise = pathname?.startsWith("/exercise/");
  const lessonOrderNumber = Number(lessonId);

  const [loading, setLoading] = useState(true);
  const [lessonHeading, setLessonHeading] = useState("");
  const [showLockModal, setShowLockModal] = useState(false);

  const [profile, setProfile] = useState<{
    user: AppUser | null;
    purchases: Purchase[];
    subscriptions: Subscription[];
    progress: Progress[];
  }>({
    user: null,
    purchases: [],
    subscriptions: [],
    progress: [],
  });

  const { course, loading: courseLoading } = useCourse(courseId);
  const { isFinished, handleNext } = useProgress(courseId, lessonId, isExercise);
  const { prev, next } = getPrevNext(course ? buildNavItems(course) : [], lessonId, isExercise);
  const { buyCourse, loading: buyLoading } = useBuyCourse();

  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) throw new Error("Profile fetch failed");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  
  const paidCourseIds = useMemo(() => {
    const ids = new Set<string>();
    for (const p of profile.purchases) {
      if (p.payment_status === "paid") {
        if (typeof p.course === "string") ids.add(p.course);
        else if (typeof p.course === "object" && p.course?.id) ids.add(p.course.id);
      }
    }
    return ids;
  }, [profile.purchases]);


  const hasFullAccess = paidCourseIds.has(courseId)
  const freeLessonLimit = hasFullAccess ? Infinity : TRIAL_LIMIT;

  
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
    if (!loading && !hasFullAccess && lessonOrderNumber > freeLessonLimit) {
      setShowLockModal(true);
    } else {
      setShowLockModal(false);
    }
  }, [loading, hasFullAccess, lessonOrderNumber, freeLessonLimit]);

  const accessContextValue = useMemo(
    () => ({
      hasFullAccess,
      accessLoading: loading,
      freeLessonLimit,
    }),
    [hasFullAccess, loading, freeLessonLimit]
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
          <NavbarContainer initialUser={profile.user as User} />
        </header>

        <div className="flex w-full">
          <aside className="fixed top-16 bottom-0 left-0 hidden lg:block w-80 bg-gray-50 overflow-y-auto hover:shadow-md z-40">
            <SidebarContainer
              course={course as CourseWithStructure}
              progress={profile.progress}
              hasFullAccess={hasFullAccess}
              isAccessLoading={loading}
            />
          </aside>

          <section
            id="lessonContent"
            className="relative flex-1 min-w-0 flex flex-col pb-16 px-6 bg-white lg:ml-80 md:mr-72 lg:mr-80 xl:mr-96"
          >
            {children}
          </section>

          <aside className="fixed top-16 bottom-0 right-0 hidden md:block w-72 lg:w-80 xl:w-96 bg-gray-50 overflow-y-auto hover:shadow-md z-40">
            <ChatbotSidebar course={courseId} topic={lessonHeading} />
          </aside>
        </div>

        {/* Footer */}
        {!courseLoading && (
          <Footer
            className="absolute bottom-0 left-0 right-0 lg:left-80 md:right-72 lg:right-80 xl:right-96"
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

        {/* 🔒 Lock Modal */}
        <AnimatePresence>
          {showLockModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
              >
                <button
                  onClick={() => setShowLockModal(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>

                <Lock className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  To jest płatna lekcja 🔒
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Możesz korzystać z pierwszych{" "}
                  <span className="font-semibold text-green-700">{TRIAL_LIMIT}</span> lekcji za darmo.
                  Aby kontynuować naukę w kursie{" "}
                  <span className="font-semibold text-green-700">{courseId}</span>, wykup dostęp poniżej.
                </p>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={async () => {
                    try {
const url = (await buyCourse(courseId)) as string | undefined;
if (typeof url === "string" && url.trim() !== "") {
  window.open(url, "_blank");
}
                    } catch (err) {
                      console.error("Buy course redirect failed:", err);
                    }
                  }}
                  disabled={buyLoading === `buy-${courseId}`}
                  className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-amber-700 focus-visible:ring-2 focus-visible:ring-amber-400 ${buyLoading === `buy-${courseId}` ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {buyLoading === `buy-${courseId}`
                    ? "Przekierowywanie..."
                    : "Kup kurs"}
                </motion.button>

                <p className="mt-4 text-xs text-gray-400">
                  Po zakupie natychmiast uzyskasz pełny dostęp do wszystkich lekcji i ćwiczeń.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </CourseAccessContext.Provider>
  );
}

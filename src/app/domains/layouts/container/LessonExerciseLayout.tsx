"use client";

import { useEffect, useMemo, useState } from "react";
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
import { FREE_LESSON_LIMIT } from "@/app/domains/lessons/constants";
import { CourseAccessContext } from "@/app/domains/lessons/context/CourseAccessContext";

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
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [paywallState, setPaywallState] = useState<{
    open: boolean;
    lessonOrder: number;
    isExercise: boolean;
  }>({
    open: false,
    lessonOrder: 0,
    isExercise: false,
  });


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

  const lessonOrderNumber = useMemo(() => {
    const parsed = Number(lessonId);
    if (Number.isNaN(parsed)) return null;
    return parsed;
  }, [lessonId]);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" });
        if (!res.ok) throw new Error("Unauthorized");
        const { user } = await res.json();
        setUser(user);
      } catch (err) {
        console.error("Failed to load user:", err);
        setUser(null);
      } finally {
        setUserLoaded(true);
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

  useEffect(() => {
    if (!courseId || lessonOrderNumber == null) return;

    if (lessonOrderNumber <= FREE_LESSON_LIMIT) {
      setAccessLoading(false);
      setAccessError(null);
      return;
    }

    let isCancelled = false;
    const abortController = new AbortController();

    async function loadAccess() {
      setAccessLoading(true);
      setAccessError(null);

      try {
        // Server endpoint double-checks purchases/subscriptions before exposing premium lessons.
        const res = await fetch(`/api/access/course?courseId=${courseId}`, {
          cache: "no-store",
          signal: abortController.signal,
        });

        if (!res.ok) {
          if (res.status !== 401 && !isCancelled) {
            setAccessError("Nie udalo sie potwierdzic Twojego dostepu.");
          }
          if (!isCancelled) {
            setHasFullAccess(false);
          }
          return;
        }

        const data = await res.json();
        if (!isCancelled) {
          setHasFullAccess(Boolean(data.hasAccess));
        }
      } catch (error) {
        if (isCancelled) return;
        console.error("Failed to load access data:", error);
        setAccessError("Nie udalo sie potwierdzic Twojego dostepu.");
        setHasFullAccess(false);
      } finally {
        if (!isCancelled) {
          setAccessLoading(false);
        }
      }
    }

    loadAccess();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [courseId, lessonOrderNumber]);

  const { course, loading } = useCourse(courseId);
  const items = course ? buildNavItems(course) : [];
  const { prev, next } = getPrevNext(items, lessonId, isExercise);
  const { isFinished, handleNext } = useProgress(courseId, lessonId, isExercise);

  const isLockedLessonView =
    !accessLoading &&
    !hasFullAccess &&
    typeof lessonOrderNumber === "number" &&
    lessonOrderNumber > FREE_LESSON_LIMIT;

  const requiresAuthentication =
    typeof lessonOrderNumber === "number" && lessonOrderNumber > FREE_LESSON_LIMIT;

  useEffect(() => {
    if (!lessonOrderNumber) return;
    if (accessLoading) return;

    // Client guard mirrors server-side restriction to stop locked content rendering.
    if (hasFullAccess || lessonOrderNumber <= FREE_LESSON_LIMIT) {
      setPaywallState((prev) => (prev.open ? { ...prev, open: false } : prev));
      return;
    }

    setPaywallState((prev) => ({
      open: true,
      lessonOrder: lessonOrderNumber,
      isExercise,
    }));
  }, [accessLoading, hasFullAccess, isExercise, lessonOrderNumber]);

  const handleLockedLessonAttempt = (payload: {
    lessonId: string;
    lessonOrder: number;
    isExercise: boolean;
  }) => {
    setPaywallState({
      open: true,
      lessonOrder: payload.lessonOrder,
      isExercise: payload.isExercise,
    });
  };

  const handleClosePaywall = () =>
    setPaywallState((prev) => ({ ...prev, open: false }));

  const handleExploreFreeLessons = () => {
    if (!courseId) return;

    const candidate =
      typeof lessonOrderNumber === "number"
        ? Math.min(FREE_LESSON_LIMIT, Math.max(lessonOrderNumber, 1))
        : FREE_LESSON_LIMIT;

    const targetLesson = Math.max(1, candidate);
    handleClosePaywall();
    router.push(`/lessons/${courseId}/${targetLesson}`);
  };

  const handleGoToSubscribe = () => {
    router.push("/profile?tab=kursy");
  };

  const accessContextValue = useMemo(
    () => ({
      hasFullAccess,
      accessLoading,
      freeLessonLimit: FREE_LESSON_LIMIT,
    }),
    [hasFullAccess, accessLoading]
  );

  if (!course) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-500">
        Ladowanie kursu...
      </main>
    );
  }

  if (requiresAuthentication && !userLoaded) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-500">
        Weryfikujemy dostep...
      </main>
    );
  }

  return (
    <CourseAccessContext.Provider value={accessContextValue}>
      <main className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 h-16 bg-white border-b">
        <NavbarContainer initialUser={user} />
      </header>

      <div className="flex w-full">
        <aside className="fixed top-16 bottom-0 left-0 hidden lg:block w-80 bg-gray-50 overflow-y-auto hover:shadow-md transition-shadow z-40">
          {!loadingProgress ? (
            <SidebarContainer
              course={course}
              progress={progress}
              hasFullAccess={hasFullAccess}
              isAccessLoading={accessLoading}
              onLockedLessonAttempt={handleLockedLessonAttempt}
            />
          ) : (
            <div className="p-4 text-gray-500">Ladowanie kursu...</div>
          )}
        </aside>

        <section
          id="htmlContent"
          className="flex-1 min-w-0 flex flex-col pb-16 px-6 bg-white lg:ml-80 md:mr-72 lg:mr-80 xl:mr-96"
        >
          {accessError && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {accessError}
            </div>
          )}

          {isLockedLessonView ? (
            <LockedLessonNotice
              lessonOrder={lessonOrderNumber ?? FREE_LESSON_LIMIT + 1}
              onSubscribe={handleGoToSubscribe}
              onExploreFree={handleExploreFreeLessons}
            />
          ) : (
            children
          )}
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
            isLockedLessonView
              ? setPaywallState((prev) => ({
                  open: true,
                  lessonOrder: lessonOrderNumber ?? FREE_LESSON_LIMIT + 1,
                  isExercise,
                }))
              : handleNext(async () => {
                  setReloadProgress((value) => !value);
                  await new Promise((resolve) => setTimeout(resolve, 150));
                  if (next) router.push(getPath(courseId, next));
                })
          }
          prevDisabled={!prev}
          nextDisabled={!next || isLockedLessonView}
          prevLabel="Wstecz"
          nextLabel={isFinished ? "Dalej" : "Zakoncz"}
          hideFinish={isFinished}
        />
      )}

        <PaywallModal
          open={paywallState.open}
          lessonOrder={
            paywallState.lessonOrder ||
            lessonOrderNumber ||
            FREE_LESSON_LIMIT + 1
          }
          isExercise={paywallState.isExercise}
          onClose={handleClosePaywall}
          onSubscribe={handleGoToSubscribe}
          onExploreFree={handleExploreFreeLessons}
        />
      </main>
    </CourseAccessContext.Provider>
  );
}

type PaywallModalProps = {
  open: boolean;
  lessonOrder: number;
  isExercise: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  onExploreFree: () => void;
};

function PaywallModal({
  open,
  lessonOrder,
  isExercise,
  onClose,
  onSubscribe,
  onExploreFree,
}: PaywallModalProps) {
  if (!open) return null;

  const lessonLabel = isExercise ? "cwiczenie" : "lekcja";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">
          Ta {lessonLabel} (# {lessonOrder}) wymaga aktywnej subskrypcji
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Pierwsze {FREE_LESSON_LIMIT} lekcji sa dostepne bezplatnie. Od lekcji{" "}
          {FREE_LESSON_LIMIT + 1} wszystkie tresci i cwiczenia wymagaja aktywnego
          planu premium lub waznego zakupu kursu.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onExploreFree}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Przegladaj darmowe lekcje
          </button>
          <button
            type="button"
            onClick={onSubscribe}
            className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            Zobacz oferte
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-xs font-medium text-gray-400 underline transition hover:text-gray-500"
        >
          Zamknij okno
        </button>
      </div>
    </div>
  );
}

type LockedLessonNoticeProps = {
  lessonOrder: number;
  onSubscribe: () => void;
  onExploreFree: () => void;
};

function LockedLessonNotice({
  lessonOrder,
  onSubscribe,
  onExploreFree,
}: LockedLessonNoticeProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center text-gray-700">
      <div className="max-w-lg space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Lekcja {lessonOrder} jest zablokowana
        </h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Aby kontynuowac nauke i odblokowac wszystkie materialy, aktywuj plan
          premium lub zakup dostep do kursu. Pierwsze {FREE_LESSON_LIMIT} lekcji
          pozostaje bezplatnych, dzieki czemu mozesz spokojnie przetestowac kurs.
          <br />
          <span className="font-medium text-gray-700">
            Back-end powinien potwierdzac status platnosci zanim dostarczy tresc lekcji.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onExploreFree}
          className="rounded-md border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Wroc do darmowych lekcji
        </button>
        <button
          type="button"
          onClick={onSubscribe}
          className="rounded-md bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
        >
          Przejdz do oferty
        </button>
      </div>
    </div>
  );
}

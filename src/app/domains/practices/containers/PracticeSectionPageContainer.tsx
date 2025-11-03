"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import PromoBanner from "@/app/domains/layouts/components/PromoBanner";
import PracticeLevelSelector from "../components/PracticeLevelSelector";
import PracticeTasksSection from "../components/PracticeTasksSection";
import PracticeFlashcardsSection from "../components/PracticeFlashcardsSection";
import PracticeVocabularySection from "../components/PracticeVocabularySection";
import PracticeShareBanner from "../components/PracticeShareBanner";
import { usePracticeLevels } from "../features/usePracticeLevels";
import { type PracticeSectionKey, getPracticeSectionMeta } from "../constants";
import {
  buildInitialSummaries,
  calculateAllSummaries,
  type SectionSummary,
} from "../utils/progress";
import type { MobileLevel } from "@/types";

type Props = {
  section: PracticeSectionKey;
};

const SELECTED_LEVEL_STORAGE_KEY = "practice:selectedLevel";

function summariesEqual(
  a: Record<PracticeSectionKey, SectionSummary>,
  b: Record<PracticeSectionKey, SectionSummary>
) {
  return (
    a.tasks.total === b.tasks.total &&
    a.tasks.attempted === b.tasks.attempted &&
    a.tasks.correct === b.tasks.correct &&
    a.flashcards.total === b.flashcards.total &&
    a.flashcards.attempted === b.flashcards.attempted &&
    a.flashcards.correct === b.flashcards.correct &&
    a.vocabulary.total === b.vocabulary.total &&
    a.vocabulary.attempted === b.vocabulary.attempted &&
    a.vocabulary.correct === b.vocabulary.correct
  );
}

export default function PracticeSectionPageContainer({ section }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { levels, loading, error, defaultLevel } = usePracticeLevels();
  const [selectedLevel, setSelectedLevel] = useState<MobileLevel | null>(null);
  const [summaries, setSummaries] = useState(() => buildInitialSummaries(null));
  const [hydrated, setHydrated] = useState(false);
  const lastSyncedLevelId = useRef<string | null>(null);
  const initialLevelResolved = useRef(false);

  const meta = useMemo(() => getPracticeSectionMeta(section), [section]);
  const initialLevelId = searchParams.get("level");

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (
      !hydrated ||
      initialLevelResolved.current ||
      !levels.length
    ) {
      return;
    }

    let resolved: MobileLevel | null = null;

    if (initialLevelId) {
      resolved = levels.find((level) => level.id === initialLevelId) ?? null;
    }

    if (!resolved) {
      const storedId =
        typeof window !== "undefined"
          ? window.localStorage.getItem(SELECTED_LEVEL_STORAGE_KEY)
          : null;
      if (storedId) {
        resolved = levels.find((level) => level.id === storedId) ?? null;
      }
    }

    if (!resolved && defaultLevel) {
      resolved = defaultLevel;
    }

    if (!resolved) {
      resolved = levels[0] ?? null;
    }

    initialLevelResolved.current = true;
    setSelectedLevel(resolved);
  }, [hydrated, levels, defaultLevel, initialLevelId]);

  useEffect(() => {
    if (!hydrated || !selectedLevel) return;
    window.localStorage.setItem(SELECTED_LEVEL_STORAGE_KEY, selectedLevel.id);
    lastSyncedLevelId.current = selectedLevel.id;
  }, [hydrated, selectedLevel]);

  useEffect(() => {
    if (!hydrated) return;

    if (!selectedLevel) {
      setSummaries((prev) => {
        const next = buildInitialSummaries(null);
        return summariesEqual(prev, next) ? prev : next;
      });
      return;
    }

    const calculated = calculateAllSummaries(selectedLevel);
    setSummaries((prev) => (summariesEqual(prev, calculated) ? prev : calculated));
  }, [hydrated, selectedLevel]);

  const updateUrlLevel = useCallback(
    (levelId: string) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      params.set("level", levelId);
      lastSyncedLevelId.current = levelId;
      router.replace(`/practices/${section}?${params.toString()}`, { scroll: false });
    },
    [router, section]
  );

  const handleLevelSelect = useCallback(
    (level: MobileLevel) => {
      setSelectedLevel(level);
      updateUrlLevel(level.id);
    },
    [updateUrlLevel]
  );

  const handleSummaryChange = useCallback(
    (key: PracticeSectionKey, summary: SectionSummary) => {
      setSummaries((prev) => {
        const current = prev[key];
        if (
          current.total === summary.total &&
          current.attempted === summary.attempted &&
          current.correct === summary.correct
        ) {
          return prev;
        }
        return { ...prev, [key]: summary };
      });
    },
    []
  );

  const activeSummary = summaries[section];
  const accuracy =
    activeSummary.total > 0
      ? Math.round((activeSummary.correct / activeSummary.total) * 100)
      : 0;

  useEffect(() => {
    if (!hydrated || !selectedLevel) return;
    if (initialLevelId === selectedLevel.id) {
      lastSyncedLevelId.current = selectedLevel.id;
      return;
    }
    if (lastSyncedLevelId.current === selectedLevel.id) {
      return;
    }
    updateUrlLevel(selectedLevel.id);
  }, [hydrated, selectedLevel, initialLevelId, updateUrlLevel]);

  const renderSection = () => {
    if (!selectedLevel) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Wybierz poziom, aby rozpocząć</h3>
          <p className="mt-2 text-sm text-slate-500">
            Wybierz poziom z listy powyżej – dzięki temu dopasujemy zadania, fiszki lub słownictwo
            do Twojego etapu nauki.
          </p>
        </div>
      );
    }

    if (section === "tasks") {
      return (
        <PracticeTasksSection
          levelId={selectedLevel.id}
          levelLabel={selectedLevel.level}
          tasks={selectedLevel.tasks}
          onSummaryChange={(summary) => handleSummaryChange("tasks", summary)}
        />
      );
    }

    if (section === "flashcards") {
      return (
        <PracticeFlashcardsSection
          levelId={selectedLevel.id}
          levelLabel={selectedLevel.level}
          flashcards={selectedLevel.flashcards}
          onSummaryChange={(summary) => handleSummaryChange("flashcards", summary)}
        />
      );
    }

    return (
      <PracticeVocabularySection
        levelId={selectedLevel.id}
        levelLabel={selectedLevel.level}
        vocabulary={selectedLevel.vocabulary}
        onSummaryChange={(summary) => handleSummaryChange("vocabulary", summary)}
      />
    );
  };

  if (loading) {
    return (
      <>
        <NavbarContainer initialUser={null} />
        <PromoBanner />
        <main className="bg-slate-50 pb-20">
          <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
            <div className="h-48 animate-pulse rounded-3xl bg-slate-200/60" />
            <div className="h-64 animate-pulse rounded-3xl bg-slate-200/60" />
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <NavbarContainer initialUser={null} />
      <PromoBanner />
      <main className="flex flex-col gap-12 bg-slate-50 pb-20">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-10">
          <Link
            href="/practices"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600"
          >
            <FiArrowLeft className="text-sm" />
            Wróć do wyboru sekcji
          </Link>

          <div
            className={`relative overflow-hidden rounded-3xl border border-transparent bg-gradient-to-br ${meta.gradient} p-8 text-white shadow-xl`}
          >
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em]">
                {meta.badge}
              </span>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
                {meta.heroTitle}
              </h1>
              <p className="max-w-3xl text-sm text-white/80 sm:text-base">
                {meta.heroDescription}
              </p>

              <dl className="grid gap-4 text-sm sm:grid-cols-3">
                <div className="rounded-2xl bg-white/15 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                    Zadania razem
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold">{activeSummary.total}</dd>
                </div>
                <div className="rounded-2xl bg-white/15 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                    Zaliczono
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold">
                    {activeSummary.correct}/{activeSummary.total || 0}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white/15 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                    Skuteczność
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold">
                    {activeSummary.total ? `${accuracy}%` : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Wybierz poziom</h2>
                  <p className="text-xs text-slate-500">
                    Możesz przełączać poziomy w każdej chwili – postępy zapisujemy osobno dla
                    każdego z nich.
                  </p>
                </div>
                {selectedLevel && (
                  <span className="rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold text-white">
                    Aktualnie: {selectedLevel.level}
                  </span>
                )}
              </div>

              <PracticeLevelSelector
                levels={levels}
                selectedLevel={selectedLevel?.level ?? null}
                onSelect={handleLevelSelect}
                loading={false}
              />

              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-10 px-6">
          {renderSection()}
          <PracticeShareBanner
            levelLabel={selectedLevel?.level ?? "—"}
            tasks={summaries.tasks}
            flashcards={summaries.flashcards}
            vocabulary={summaries.vocabulary}
          />
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Chcesz przejść do innej sekcji praktyk?
              </p>
              <p className="text-xs text-slate-500">
                Wróć do ekranu wyboru, aby wybrać fiszki lub słownictwo. Twoje wyniki zostaną
                zachowane.
              </p>
            </div>
            <Link
              href="/practices"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
            >
              Wybierz inną sekcję
              <FiArrowRight className="text-base" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

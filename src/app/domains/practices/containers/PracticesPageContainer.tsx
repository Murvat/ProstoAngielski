"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiBarChart2, FiPlay } from "react-icons/fi";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import PromoBanner from "@/app/domains/layouts/components/PromoBanner";
import PracticeHero from "../components/PracticeHero";
import PracticeLevelSelector from "../components/PracticeLevelSelector";
import { usePracticeLevels } from "../features/usePracticeLevels";
import type { MobileLevel } from "@/types";
import {
  PRACTICE_SECTION_KEYS,
  PRACTICE_SECTION_META,
  type PracticeSectionKey,
} from "../constants";
import {
  buildInitialSummaries,
  calculateAllSummaries,
  type SectionSummary,
} from "../utils/progress";

type SummariesMap = Record<PracticeSectionKey, SectionSummary>;

const CTA_LABEL: Record<PracticeSectionKey, string> = {
  tasks: "Rozpocznij ćwiczenia",
  flashcards: "Otwórz fiszki",
  vocabulary: "Wejdź do słownictwa",
};

const SELECTED_LEVEL_STORAGE_KEY = "practice:selectedLevel";

export default function PracticesPageContainer() {
  const router = useRouter();
  const { levels, loading, error, defaultLevel } = usePracticeLevels();
  const [selectedLevel, setSelectedLevel] = useState<MobileLevel | null>(null);
  const [summaries, setSummaries] = useState<SummariesMap>(() => buildInitialSummaries(null));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || selectedLevel || !levels.length) return;

    const storedId =
      typeof window !== "undefined"
        ? window.localStorage.getItem(SELECTED_LEVEL_STORAGE_KEY)
        : null;

    if (storedId) {
      const storedLevel = levels.find((level) => level.id === storedId);
      if (storedLevel) {
        setSelectedLevel(storedLevel);
        return;
      }
    }

    if (defaultLevel) {
      setSelectedLevel(defaultLevel);
      return;
    }

    setSelectedLevel(levels[0] ?? null);
  }, [hydrated, levels, defaultLevel, selectedLevel]);

  useEffect(() => {
    if (!hydrated || !selectedLevel) return;
    window.localStorage.setItem(SELECTED_LEVEL_STORAGE_KEY, selectedLevel.id);
  }, [hydrated, selectedLevel]);

  useEffect(() => {
    if (!selectedLevel) {
      setSummaries(buildInitialSummaries(null));
      return;
    }
    setSummaries(buildInitialSummaries(selectedLevel));
  }, [selectedLevel]);

  useEffect(() => {
    if (!hydrated || !selectedLevel) return;
    setSummaries(calculateAllSummaries(selectedLevel));
  }, [hydrated, selectedLevel]);

  const handleNavigate = (section: PracticeSectionKey) => {
    const basePath = `/practices/${section}`;
    const href = selectedLevel ? `${basePath}?level=${selectedLevel.id}` : basePath;
    router.push(href);
  };

  const cardItems = useMemo(
    () =>
      PRACTICE_SECTION_KEYS.map((section) => {
        const meta = PRACTICE_SECTION_META[section];
        const summary = summaries[section];
        const accuracy =
          summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;
        return { section, meta, summary, accuracy };
      }),
    [summaries]
  );

  if (loading) {
    return (
      <>
        <NavbarContainer initialUser={null} />
        <PromoBanner />
        <main className="flex flex-col gap-12 bg-slate-50 pb-20">
          <PracticeHero />
          <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
            <header className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Wybierz poziom kursu mobilnego
              </h2>
              <p className="text-sm text-gray-500">
                Każdy poziom zawiera pełny pakiet zadań, fiszek i słownictwa. Wyniki zapisują się w
                pamięci Twojej przeglądarki – możesz wrócić w dowolnym momencie.
              </p>
              <PracticeLevelSelector
                levels={levels}
                loading={loading}
                selectedLevel={null}
                onSelect={(level) => setSelectedLevel(level)}
              />
            </header>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white"
                />
              ))}
            </div>
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
        <PracticeHero />
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
              <FiBarChart2 className="text-base text-emerald-500" />
              Krok 1: wybierz poziom mobilnego kursu
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Wybierz poziom i odkryj strefę praktyk
            </h2>
            <p className="max-w-3xl text-sm text-slate-500 sm:text-base">
              Najpierw dobierz poziom, a następnie zdecyduj, w którą sekcję chcesz wejść: ćwiczenia,
              fiszki lub słownictwo. Każda sekcja ma własny postęp i zapisuje Twoje wyniki w
              przeglądarce.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Wybierz poziom kursu mobilnego
                  </h3>
                  {selectedLevel && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Wybrany poziom: {selectedLevel.level}
                    </span>
                  )}
                </div>
                <PracticeLevelSelector
                  levels={levels}
                  loading={false}
                  selectedLevel={selectedLevel?.level ?? null}
                  onSelect={(level) => setSelectedLevel(level)}
                />
                {error && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}
                {!selectedLevel && (
                  <p className="text-xs text-slate-500">
                    Wybierz poziom, aby uwolnić wszystkie sekcje praktyk. Jeśli pominiesz ten krok,
                    otworzymy domyślny poziom.
                  </p>
                )}
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              <FiPlay className="text-base" />
              Krok 2: wybierz tryb nauki
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cardItems.map(({ section, meta, summary, accuracy }) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => handleNavigate(section)}
                  className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
                >
                  <div className="space-y-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ring-1 ${meta.badgeClassName}`}
                    >
                      {meta.badge}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">{meta.cardTitle}</h3>
                    <p className="text-sm text-slate-600">{meta.cardDescription}</p>
                  </div>

                  <div className="space-y-5">
                    <dl className="grid gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 text-xs text-slate-500 sm:grid-cols-3">
                      <div>
                        <dt className="font-semibold uppercase tracking-wide text-slate-400">
                          Razem
                        </dt>
                        <dd className={`text-lg font-semibold ${meta.statAccent}`}>
                          {summary.total}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold uppercase tracking-wide text-slate-400">
                          Zaliczono
                        </dt>
                        <dd className={`text-lg font-semibold ${meta.statAccent}`}>
                          {summary.correct}/{summary.total || 0}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold uppercase tracking-wide text-slate-400">
                          Skuteczność
                        </dt>
                        <dd className={`text-lg font-semibold ${meta.statAccent}`}>
                          {summary.total ? `${accuracy}%` : "—"}
                        </dd>
                      </div>
                    </dl>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-500">
                        {selectedLevel
                          ? `Poziom ${selectedLevel.level} • Postęp zapisuje się automatycznie`
                          : "Najpierw wybierz poziom, aby zapisać postęp"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-slate-800`}
                      >
                        {CTA_LABEL[section]}
                        <FiArrowRight className="text-sm" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-500 shadow-sm">
            <p>
              W dowolnym momencie możesz wrócić do tego ekranu, aby przełączyć sekcję lub zmienić
              poziom. Każdy tryb działa niezależnie, ale postępy sumują się w banerze podsumowującym
              na stronach ćwiczeń.
            </p>
            <Link
              href="/signup"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Chcesz zapisywać wyniki w chmurze? Załóż konto i odblokuj pełen kurs.
              <FiArrowRight className="text-sm" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

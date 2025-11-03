"use client";

import { useEffect, useMemo, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import FillGapsExerciseContainer from "./FillGapsExerciseContainer";
import ChooseDefinitionExerciseContainer from "./ChooseDefinitionExerciseContainer";
import TranslateExerciseContainer from "./TranslateExerciseContainer";
import { useExercise } from "../features/useExercise";
import { useCourseAccessContext } from "@/app/domains/lessons/context/CourseAccessContext";
import type { FillGapsItem, ChooseDefinitionItem, TranslateItem } from "@/types";

type ExerciseFlowProps = {
  id: string;
  courseId: string;
};

type Section =
  | { id: "fill"; title: string; subtitle: string; description: string; items: FillGapsItem[] }
  | { id: "definition"; title: string; subtitle: string; description: string; items: ChooseDefinitionItem[] }
  | { id: "translate"; title: string; subtitle: string; description: string; items: TranslateItem[] };

export default function ExerciseFlow({ id, courseId }: ExerciseFlowProps) {
  const { width, height } = useWindowSize();
  const { hasFullAccess, accessLoading, freeLessonLimit } = useCourseAccessContext();

  const lessonOrder = Number(id);
  const isLocked =
    !accessLoading && !hasFullAccess && !Number.isNaN(lessonOrder) && lessonOrder > freeLessonLimit;

  const { exercises, loading, error } = useExercise(id, courseId, { enabled: !isLocked });

  const [completedSections, setCompletedSections] = useState(0);

  const sections: Section[] = useMemo(() => {
    if (!exercises) {
      return [];
    }

    const bucket: Section[] = [];

    if (exercises.fillGaps.length) {
      bucket.push({
        id: "fill",
        title: "Fill in blank",
        subtitle: "Uzupełnij luki",
        description:
          "Wpisz brakujące słowa, aby zdania brzmiały naturalnie i były poprawne gramatycznie. Wskazówki pomogą Ci wyłapać kontekst.",
        items: exercises.fillGaps,
      });
    }

    if (exercises.chooseDefinition.length) {
      bucket.push({
        id: "definition",
        title: "Multiple choice",
        subtitle: "Wybierz właściwą odpowiedź",
        description:
          "Zaznacz poprawną odpowiedź spośród dostępnych opcji. Zwróć uwagę na niuanse znaczeniowe i dopasowanie do zdania.",
        items: exercises.chooseDefinition,
      });
    }

    if (exercises.translate.length) {
      bucket.push({
        id: "translate",
        title: "Error correction",
        subtitle: "Tłumaczenie i korekta",
        description:
          "Przetłumacz zdania albo popraw błędy. To świetny moment, żeby utrwalić struktury gramatyczne i nowe słownictwo.",
        items: exercises.translate,
      });
    }

    return bucket;
  }, [exercises]);

  const totalSections = sections.length;

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(`exercise-progress-${id}`) : null;
    if (saved) {
      setCompletedSections(Number(saved));
    }
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`exercise-progress-${id}`, String(completedSections));
    }
  }, [id, completedSections]);

  const handleSectionComplete = () => {
    setCompletedSections((prev) => Math.min(prev + 1, totalSections));
  };

  const renderSection = (section: Section, lessonId: string, onComplete: () => void) => {
    switch (section.id) {
      case "fill":
        return <FillGapsExerciseContainer items={section.items} lessonId={lessonId} onComplete={onComplete} />;
      case "definition":
        return (
          <ChooseDefinitionExerciseContainer items={section.items} lessonId={lessonId} onComplete={onComplete} />
        );
      case "translate":
        return <TranslateExerciseContainer items={section.items} lessonId={lessonId} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  if (accessLoading) {
    return <p className="p-6 text-sm text-gray-500">Sprawdzamy dostęp do ćwiczeń...</p>;
  }

  if (isLocked) {
    return (
      <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-700">
        Te ćwiczenia odblokujesz po zakupie pełnej wersji kursu.
      </section>
    );
  }

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Ładuję zestaw ćwiczeń...</p>;
  }

  if (error) {
    return <p className="p-6 text-sm text-red-500">Wystąpił błąd: {error}</p>;
  }

  if (!exercises || sections.length === 0) {
    return <p className="p-6 text-sm text-gray-500">Brak ćwiczeń dla tej lekcji.</p>;
  }

  const progress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-sky-500 to-teal-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_65%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-white md:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                Ćwiczenia · Lekcja {Number.isNaN(lessonOrder) ? "—" : lessonOrder}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Trenuj umiejętności krok po kroku
              </h1>
              <p className="max-w-2xl text-sm text-white/90 md:text-base">
                Każdy moduł ćwiczeń skupia się na innym obszarze języka. Uzupełnij luki, wybierz właściwe odpowiedzi,
                przetłumacz zdania i obserwuj, jak Twój postęp rośnie z każdą sekcją.
              </p>
              <ul className="grid gap-3 text-sm text-white/90 sm:grid-cols-2">
                <li className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-200" />
                  Adaptacyjne podpowiedzi i analiza odpowiedzi
                </li>
                <li className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-200" />
                  Automatyczne zapisywanie postępów w module
                </li>
              </ul>
            </div>

            <div className="grid w-full max-w-sm gap-4 text-sm text-white/90">
              <div className="rounded-3xl border border-white/30 bg-white/15 px-6 py-5 shadow-lg backdrop-blur">
                <p className="text-xs uppercase text-white/70">Postęp całego zestawu</p>
                <p className="text-2xl font-semibold">{progress}%</p>
                <div className="mt-3 h-2 rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-white/90 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/30 bg-white/15 px-6 py-5 shadow-lg backdrop-blur">
                <p className="text-xs uppercase text-white/70">Zakończone sekcje</p>
                <p className="text-2xl font-semibold">
                  {completedSections}/{totalSections}
                </p>
              </div>

              <div className="rounded-3xl border border-white/30 bg-white/10 px-6 py-5 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                Zachowujemy Twoje odpowiedzi, abyś mógł wrócić w dowolnym momencie.
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 pb-24 md:px-8">
        <div className="grid gap-8">
          {sections.map((section, index) => (
            <section
              key={section.id}
              className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/40 md:p-8"
            >
              <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                    Moduł {index + 1}
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                    <p className="text-sm text-emerald-600">{section.subtitle}</p>
                  </div>
                  <p className="max-w-2xl text-sm text-gray-600 md:text-base">{section.description}</p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-emerald-700 shadow-inner">
                  {completedSections > index ? "Zakończony moduł" : "Do zrealizowania"}
                </div>
              </header>

              <div className="mt-6">
                {renderSection(section, id, handleSectionComplete)}
              </div>
            </section>
          ))}
        </div>
      </main>

      {completedSections === totalSections && totalSections > 0 && (
        <Confetti width={width} height={height} numberOfPieces={260} recycle={false} gravity={0.3} />
      )}
    </div>
  );
}


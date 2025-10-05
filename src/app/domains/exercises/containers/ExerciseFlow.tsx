"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import FillGapsExerciseContainer from "./FillGapsExerciseContainer";
import ChooseDefinitionExerciseContainer from "./ChooseDefinitionExerciseContainer";
import TranslateExerciseContainer from "./TranslateExerciseContainer";
import { useExercise } from "../features/useExercise";

export default function ExerciseFlow({
  id,
  courseId,
}: {
  id: string;
  courseId: string;
}) {
  const { width, height } = useWindowSize();
  const { exercises, loading, error } = useExercise(id, courseId);

  const [completedSections, setCompletedSections] = useState(0);

  const totalSections =
    (exercises?.fillGaps.length ? 1 : 0) +
    (exercises?.chooseDefinition.length ? 1 : 0) +
    (exercises?.translate.length ? 1 : 0);

  // 🔹 Wczytaj postęp
  useEffect(() => {
    const saved = localStorage.getItem(`exercise-progress-${id}`);
    if (saved) {
      setCompletedSections(Number(saved));
    }
  }, [id]);

  // 🔹 Zapisz postęp
  useEffect(() => {
    localStorage.setItem(`exercise-progress-${id}`, String(completedSections));
  }, [id, completedSections]);

  const handleSectionComplete = () => {
    setCompletedSections((prev) => Math.min(prev + 1, totalSections));
  };

  if (loading) return <p className="p-6">Ładowanie ćwiczeń…</p>;
  if (error) return <p className="p-6 text-red-500">Błąd: {error}</p>;
  if (!exercises) return <p className="p-6">Nie znaleziono ćwiczeń.</p>;

  return (
    <div className="flex-1 flex flex-col px-2 py-2 bg-white space-y-3">
      {/* Sekcja 1 - Uzupełnij luki */}
      {exercises.fillGaps.length > 0 && (
        <div className="space-y-1 hover:bg-green-50 rounded-lg p-2 transition-colors cursor-pointer">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-green-600">1.</span>
            Uzupełnij luki
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Wpisz brakujące słowa w zdaniach.
          </p>
          <FillGapsExerciseContainer
            items={exercises.fillGaps}
            onComplete={handleSectionComplete}
            lessonId={id}
          />
        </div>
      )}

      {/* Sekcja 2 - Wybierz definicję */}
      {exercises.chooseDefinition.length > 0 && (
        <div className="space-y-1 hover:bg-green-50 rounded-lg p-2 transition-colors cursor-pointer">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-green-600">2.</span>
            Wybierz definicję
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Wybierz poprawne znaczenie każdego słowa lub wyrażenia.
          </p>
          <ChooseDefinitionExerciseContainer
            items={exercises.chooseDefinition}
            onComplete={handleSectionComplete}
            lessonId={id}
          />
        </div>
      )}

      {/* Sekcja 3 - Przetłumacz */}
      {exercises.translate.length > 0 && (
        <div className="space-y-1 hover:bg-green-50 rounded-lg p-2 transition-colors cursor-pointer">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-green-600">3.</span>
            Przetłumacz
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Przetłumacz zdania z języka polskiego na angielski.
          </p>
          <TranslateExerciseContainer
            items={exercises.translate}
            onComplete={handleSectionComplete}
            lessonId={id}
          />
        </div>
      )}

      {/* 🎉 Konfetti po ukończeniu */}
      {completedSections === totalSections && totalSections > 0 && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          recycle={false}
          gravity={0.3}
        />
      )}
    </div>
  );
}

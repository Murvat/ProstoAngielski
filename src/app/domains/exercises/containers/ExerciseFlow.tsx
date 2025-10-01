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

  // 🔹 Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(`exercise-progress-${id}`);
     console.log("🔄 Loaded section progress:", saved);
    if (saved) {
      setCompletedSections(Number(saved));
    }
  }, [id]);

  // 🔹 Save progress when it changes
  useEffect(() => {
     console.log("💾 Saving section progress:", completedSections);
    localStorage.setItem(`exercise-progress-${id}`, String(completedSections));
    
  }, [id, completedSections]);

  const handleSectionComplete = () => {
    setCompletedSections((prev) => Math.min(prev + 1, totalSections));
  };

  if (loading) return <p className="p-6">Loading exercises…</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!exercises) return <p className="p-6">No exercises found.</p>;

  return (
<div className="flex-1 flex flex-col px-2 py-2 bg-white space-y-3">
      {/* Section 1 - Fill Gaps */}
      {exercises.fillGaps.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-green-600">1.</span>
            Fill the Gaps
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Complete the sentences with the correct missing words.
          </p>
          <FillGapsExerciseContainer
            items={exercises.fillGaps}
            onComplete={handleSectionComplete}
              lessonId={id} 
          />
        </div>
      )}

      {/* Section 2 - Choose Definition */}
      {exercises.chooseDefinition.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-green-600">2.</span>
            Choose the Definition
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Pick the correct meaning for each word or phrase.
          </p>
          <ChooseDefinitionExerciseContainer
            items={exercises.chooseDefinition}
            onComplete={handleSectionComplete}
              lessonId={id} 
          />
        </div>
      )}

      {/* Section 3 - Translate */}
      {exercises.translate.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-green-600">3.</span>
            Translate
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Translate the Polish sentences into English.
          </p>
          <TranslateExerciseContainer
            items={exercises.translate}
            onComplete={handleSectionComplete}
              lessonId={id} 
          />
        </div>
      )}

      {/* Confetti celebration */}
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

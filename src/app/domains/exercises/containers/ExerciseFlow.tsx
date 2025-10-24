"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import FillGapsExerciseContainer from "./FillGapsExerciseContainer";
import ChooseDefinitionExerciseContainer from "./ChooseDefinitionExerciseContainer";
import TranslateExerciseContainer from "./TranslateExerciseContainer";
import { useExercise } from "../features/useExercise";
import { useCourseAccessContext } from "@/app/domains/lessons/context/CourseAccessContext";

type ExerciseFlowProps = {
  id: string;
  courseId: string;
};

export default function ExerciseFlow({ id, courseId }: ExerciseFlowProps) {
  const { width, height } = useWindowSize();
  const { hasFullAccess, accessLoading, freeLessonLimit } =
    useCourseAccessContext();

  const lessonOrder = Number(id);
  const isLocked =
    !accessLoading &&
    !hasFullAccess &&
    !Number.isNaN(lessonOrder) &&
    lessonOrder > freeLessonLimit;
  // The layout and API also enforce this check; this guard just avoids unnecessary client fetches.

  const { exercises, loading, error } = useExercise(id, courseId, {
    enabled: !isLocked,
  });

  const [completedSections, setCompletedSections] = useState(0);

  const totalSections =
    (exercises?.fillGaps.length ? 1 : 0) +
    (exercises?.chooseDefinition.length ? 1 : 0) +
    (exercises?.translate.length ? 1 : 0);

  // Restore saved exercise progress from localStorage.
  useEffect(() => {
    const saved = localStorage.getItem(`exercise-progress-${id}`);
    if (saved) {
      setCompletedSections(Number(saved));
    }
  }, [id]);

  // Persist local progress for later sessions.
  useEffect(() => {
    localStorage.setItem(`exercise-progress-${id}`, String(completedSections));
  }, [id, completedSections]);

  const handleSectionComplete = () => {
    setCompletedSections((prev) => Math.min(prev + 1, totalSections));
  };

  if (accessLoading) {
    return <p className="p-6 text-sm text-gray-500">Verifying your access...</p>;
  }

  if (isLocked) {
    return null;
  }

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Loading exercises...</p>;
  }

  if (error) {
    return <p className="p-6 text-sm text-red-500">Error: {error}</p>;
  }

  if (!exercises) {
    return <p className="p-6 text-sm text-gray-500">No exercises available.</p>;
  }

  return (
    <div className="flex-1 flex flex-col space-y-3 bg-white px-2 py-2">
      {/* Section 1 - Fill the gaps */}
      {exercises.fillGaps.length > 0 && (
        <div className="space-y-1 rounded-lg p-2 transition-colors hover:bg-green-50">
          <h2 className="flex items-center text-lg font-semibold">
            <span className="mr-2 text-green-600">1.</span>
            Fill the gaps
          </h2>
          <p className="mb-2 text-sm text-gray-500">
            Type the missing words to complete each sentence.
          </p>
          <FillGapsExerciseContainer
            items={exercises.fillGaps}
            onComplete={handleSectionComplete}
            lessonId={id}
          />
        </div>
      )}

      {/* Section 2 - Choose the definition */}
      {exercises.chooseDefinition.length > 0 && (
        <div className="space-y-1 rounded-lg p-2 transition-colors hover:bg-green-50">
          <h2 className="flex items-center text-lg font-semibold">
            <span className="mr-2 text-green-600">2.</span>
            Choose the definition
          </h2>
          <p className="mb-2 text-sm text-gray-500">
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
        <div className="space-y-1 rounded-lg p-2 transition-colors hover:bg-green-50">
          <h2 className="flex items-center text-lg font-semibold">
            <span className="mr-2 text-green-600">3.</span>
            Translate
          </h2>
          <p className="mb-2 text-sm text-gray-500">
            Translate the sentences into English.
          </p>
          <TranslateExerciseContainer
            items={exercises.translate}
            onComplete={handleSectionComplete}
            lessonId={id}
          />
        </div>
      )}

      {/* Confetti celebration after completing all sections */}
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

// src/app/domains/lesson/hooks/useProgress.ts
"use client";

import { useState, useEffect } from "react";

export function useProgress(
  courseId: string,
  lessonId: string,
  isExercise: boolean,
  onGoNext: () => void
) {
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔍 check existing progress when lesson/exercise loads
useEffect(() => {
  async function fetchProgress() {
    try {
      const res = await fetch(
        `/api/progress?courseId=${courseId}&lessonId=${lessonId}`
      );
      if (res.ok) {
        const data = await res.json();

        if (isExercise) {
          // Exercise button only finished if exercises are completed
          setIsFinished(data?.completed_exercises === true);
        } else {
          // Lesson button finished if row exists
          setIsFinished(data?.completed === true);
        }
      }
    } catch (err) {
      console.error("❌ Failed to load progress", err);
    }
  }
  fetchProgress();
}, [courseId, lessonId, isExercise]);

const handleNext = async () => {
  if (!isFinished) {
    try {
      setLoading(true);

      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          isExercise,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Progress update failed", err);
        return;
      }

      // ✅ Mark finished now
      setIsFinished(true);
      return;
    } finally {
      setLoading(false);
    }
  }

  // If already finished, just go next
  onGoNext();
};

  return { isFinished, handleNext, loading };
}

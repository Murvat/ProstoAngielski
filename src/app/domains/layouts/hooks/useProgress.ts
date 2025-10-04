// src/app/domains/lesson/hooks/useProgress.ts
"use client";
import { useState, useEffect } from "react";

export function useProgress(courseId: string, lessonId: string, isExercise: boolean, onGoNext: () => void) {
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch(`/api/progress?courseId=${courseId}&lessonId=${lessonId}`);
        if (!res.ok) return; // e.g. 401
        const data = await res.json();
        setIsFinished(isExercise ? data?.completed_exercises : data?.completed);
      } catch (err) {
        console.error("❌ Failed to load progress:", err);
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
          body: JSON.stringify({ courseId, lessonId, isExercise }),
        });
        if (!res.ok) throw new Error("Progress update failed");
        setIsFinished(true);
      } catch (err) {
        console.error("❌ Progress update failed:", err);
      } finally {
        setLoading(false);
      }
    } else {
      onGoNext();
    }
  };

  return { isFinished, handleNext, loading };
}

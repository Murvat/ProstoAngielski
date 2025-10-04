"use client";

import { useState, useEffect } from "react";

export function useProgress(
  courseId: string,
  lessonId: string,
  isExercise: boolean,
  
) {
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch current progress
  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch(
          `/api/progress?courseId=${courseId}&lessonId=${lessonId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setIsFinished(isExercise ? data?.completed_exercises : data?.completed);
      } catch (err) {
        console.error("❌ Failed to load progress:", err);
      }
    }
    fetchProgress();
  }, [courseId, lessonId, isExercise]);

  // 🔹 Save progress + callback
  const handleNext = async (callback?: () => void) => {
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
        callback?.(); // run callback after saving
      } catch (err) {
        console.error("❌ Progress update failed:", err);
      } finally {
        setLoading(false);
      }
    } else {
      callback?.(); // already finished
    }
  };

  return { isFinished, handleNext, loading };
}

// src/app/domains/exercise/features/useExercise.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import type { ExerciseData } from "./types";

export function useExercise(lessonId: string, courseId: string) {
  const [exercises, setExercises] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      setError(null);
console.log("📡 Fetching exercises for", { lessonId, courseId });
      const orderIndex = Number(lessonId);
      if (isNaN(orderIndex)) {
        setError("Invalid lessonId format");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("lessons")
        .select("exercises")
        .eq("course_id", courseId)
        .eq("order_index", orderIndex)
        .maybeSingle();

      if (error) {
        console.error("❌ Failed to fetch exercises", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("No exercises found for this lesson");
        setLoading(false);
        return;
      }
 console.log("✅ Got exercises from DB:", data.exercises);
      const raw = data.exercises || {};
      setExercises({
        fillGaps: raw.fillGaps ?? [],
        chooseDefinition: raw.chooseDefinition ?? [],
        translate: raw.translate ?? [],
      });
      setLoading(false);
    }

    fetchExercises();
  }, [lessonId, courseId]);

  return { exercises, loading, error };
}

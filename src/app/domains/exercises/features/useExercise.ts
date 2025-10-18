"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { getLessonExercises } from "@/lib/supabase/queries";
import type { ExerciseData } from "@/types";

export function useExercise(lessonId: string, courseId: string) {
  const [exercises, setExercises] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      setError(null);

      const orderIndex = Number(lessonId);
      if (Number.isNaN(orderIndex)) {
        setError("Invalid lessonId format");
        setLoading(false);
        return;
      }

      const { data, error } = await getLessonExercises(
        supabase,
        courseId,
        orderIndex
      );

      if (error) {
        console.error("Failed to fetch exercises", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("No exercises found for this lesson");
        setLoading(false);
        return;
      }

      setExercises(data);
      setLoading(false);
    }

    fetchExercises();
  }, [lessonId, courseId]);

  return { exercises, loading, error };
}

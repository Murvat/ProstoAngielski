"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { getCourseWithStructure } from "@/lib/supabase/queries";
import type { CourseWithStructure } from "@/types";

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<CourseWithStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);

      const { data, error } = await getCourseWithStructure(
        supabase,
        courseId
      );

      if (error) {
        console.error("Failed to fetch course", error);
        setError(new Error(error.message));
        setLoading(false);
        return;
      }

      if (!data) {
        console.warn("Course has no structure", data);
        setCourse(null);
        setLoading(false);
        return;
      }

      setCourse(data);
      setError(null);
      setLoading(false);
    }

    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
}

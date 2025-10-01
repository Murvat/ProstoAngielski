// src/app/domains/lesson/hooks/useCourse.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import type { Course } from "../../sidebar/features/types";

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);

      const { data, error } = await supabase
        .from("courses") // 👈 should be "courses"
        .select("id, title, price, structure")
        .eq("id", courseId)
        .single();

      if (error) {
        console.error("❌ Failed to fetch course", error);
        setError(error);
        setLoading(false);
        return;
      }

      if (!data?.structure) {
        console.warn("⚠️ Course has no structure", data);
        setCourse(null);
        setLoading(false);
        return;
      }

      const course: Course = {
        id: data.id,
        title: data.title,
        price:data.price,
        structure: data.structure, // ✅ matches type
      };

      setCourse(course);
      setLoading(false);
    }

    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
}

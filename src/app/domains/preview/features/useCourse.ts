"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { listCourses } from "@/lib/supabase/queries";
import type { Course } from "@/types";

export function useCourse() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await listCourses(supabase);

      if (error) {
        setError(error.message);
      } else {
        setCourses(data);
        setError(null);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}

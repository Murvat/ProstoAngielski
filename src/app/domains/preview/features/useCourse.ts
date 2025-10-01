"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase/client/supabaseClient";

export type Course = {
  id: string;
  title: string;
  short_description: string;
  level: string;
  duration: string;
  price: number;     // stored in grosze (e.g. 9900 = 99.00 zł)
  features: string[]; // array of benefits for that course
};

export function useCourse() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("price", { ascending: true }); // cheapest first

      if (error) {
        setError(error.message);
      } else {
        setCourses(data as Course[]);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}

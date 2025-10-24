"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { getLessonHeading } from "@/lib/supabase/queries";

export function useLessonHeading() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  const [lessonHeading, setLessonHeading] = useState<string>("");

  useEffect(() => {
    if (!courseId || !lessonId) return;

    const orderIndex = Number(lessonId);
    if (Number.isNaN(orderIndex)) return;

    const fetchHeading = async () => {
      const { data, error } = await getLessonHeading(
        supabase,
        courseId,
        orderIndex
      );

      if (error) {
        console.error("Failed to fetch lesson heading:", error.message);
        return;
      }

      setLessonHeading(data ?? "");
    };

    fetchHeading();
  }, [courseId, lessonId]);

  return { lessonHeading };
}

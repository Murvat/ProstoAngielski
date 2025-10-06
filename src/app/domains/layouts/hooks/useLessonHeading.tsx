"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client/supabaseClient";

export function useLessonHeading() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  const [lessonHeading, setLessonHeading] = useState<string>("");

useEffect(() => {
  if (!courseId || !lessonId) return;

  const fetchHeading = async () => {
    console.log("🔍 Fetching heading for", { courseId, lessonId }); // debug 1
const { data, error } = await supabase
  .from("lessons")
  .select("heading")
  .eq("course_id", courseId)
  .eq("order_index", parseInt(lessonId, 10))
  .single();
    if (error) console.error("❌ Supabase error:", error.message);
    else if (data?.heading) {
      console.log("✅ Heading found:", data.heading); // debug 2
      setLessonHeading(data.heading);
    } else console.warn("⚠️ No heading found for", { courseId, lessonId });
  };

  fetchHeading();
}, [courseId, lessonId]);

  return { lessonHeading };
}

"use client";

import { useRouter } from "next/navigation";
import type { FooterNav } from "@/types";

export function useFooter(
  lessons: FooterNav[],
  current: FooterNav,
  courseId: string
) {
  const router = useRouter();

  const idx = lessons.findIndex(
    (lesson) => lesson.type === current.type && lesson.id === current.id
  );

  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const buildPath = (item: FooterNav) => {
    const base = item.type === "exercise" ? "exercise" : "lessons";
    return `/${base}/${courseId}/${item.id}`;
  };

  return {
    prevDisabled: !prev,
    nextDisabled: !next,
    goPrev: () => prev && router.push(buildPath(prev)),
    goNext: () => next && router.push(buildPath(next)),
  };
}

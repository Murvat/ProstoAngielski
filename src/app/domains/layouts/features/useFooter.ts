"use client";
import { useRouter } from "next/navigation";

export type FooterNav = {
  type: "lessons" | "exercise";
  id: string;
};

export function useFooter(lessons: FooterNav[], current: FooterNav, courseId: string) {
  const router = useRouter();

  const idx = lessons.findIndex(
    (l) => l.type === current.type && l.id === current.id
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
    goPrev: () => prev && router.push(buildPath(prev)),   // ✅ navigate client-side
    goNext: () => next && router.push(buildPath(next)),   // ✅ navigate client-side
  };
}

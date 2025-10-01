"use client";

import { useEffect, useRef, useState } from "react";

export type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function useExtractHeadings(containerSelector: string = "#htmlContent") {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const nodes = Array.from(
      container.querySelectorAll<HTMLHeadingElement>("h2, h3")
    );

    nodes.forEach((el) => {
      if (!el.id) {
        const base = slugify(el.innerText);
        let id = base;
        let i = 2;
        while (document.getElementById(id)) {
          id = `${base}-${i++}`;
        }
        el.id = id;
      }
    });

    const items: TocItem[] = nodes.map((el) => ({
      id: el.id,
      text: el.innerText,
      level: Number(el.tagName.substring(1)) as 2 | 3,
    }));

    setToc(items);

    if (observerRef.current) observerRef.current.disconnect();
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop
          );
        if (visible[0]) setActiveId((visible[0].target as HTMLElement).id);
      },
      {
        root: null,
        rootMargin: "0px 0px -70% 0px",
        threshold: [0, 1.0],
      }
    );
    nodes.forEach((el) => obs.observe(el));
    observerRef.current = obs;

    return () => obs.disconnect();
  }, [containerSelector]);

  return { toc, activeId };
}

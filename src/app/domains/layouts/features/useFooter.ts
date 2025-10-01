// A simple type for navigation items
export type FooterNav = {
  type: "lessons" | "exercise";
  id: string;
};

export function useFooter(
  lessons: FooterNav[], 
  current: FooterNav
) {
  const idx = lessons.findIndex(
    (l) => l.type === current.type && l.id === current.id
  );

  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  return {
    prevDisabled: !prev,
    nextDisabled: !next,
    goPrev: () => prev,
    goNext: () => next,
  };
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Blog | ProstoAngielski",
  description:
    "Czytaj najnowsze artykuły i wskazówki językowe od zespołu ProstoAngielski.",
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}

"use client";

import type { MobileLevel } from "@/types";
import { useEffect, useState } from "react";

type Props = {
  levels: MobileLevel[];
  selectedLevel: string | null;
  onSelect: (level: MobileLevel) => void;
  loading?: boolean;
};

export default function PracticeLevelSelector({
  levels,
  selectedLevel,
  onSelect,
  loading = false,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-11 w-32 animate-pulse rounded-full bg-emerald-100/60"
          />
        ))}
      </div>
    );
  }

  if (!mounted || levels.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Brak dostępnych poziomów. Skontaktuj się z zespołem PROSTOANGIELSKI.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {levels.map((level) => {
        const isActive = selectedLevel === level.level;
        const baseStyle =
          "flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition";
        const activeStyle = "border-emerald-500 bg-emerald-500 text-white shadow-lg";
        const inactiveStyle =
          "border-emerald-200 bg-white text-emerald-600 hover:border-emerald-400 hover:text-emerald-700";
        const className = `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => onSelect(level)}
            className={className}
          >
            {level.level}
          </button>
        );
      })}
    </div>
  );
}

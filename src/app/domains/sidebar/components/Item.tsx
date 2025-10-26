"use client";

import React from "react";
import { BookOpen, PencilLine, Lock, CheckCircle2 } from "lucide-react";


type ItemProps = {
  item: { id: string; type: "lesson" | "exercise" | string; title: string };
  active: boolean;
  locked: boolean;
  completed: boolean;
  onClick: () => void;
};

function Item({
  item,
  active,
  locked,
  completed,
  onClick,
}: ItemProps) {
  const isLesson = item.type === "lesson";


  const baseClasses =
    "flex items-center gap-3.5 w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200 text-sm";
  const stateClasses = active
    ? "bg-green-100 text-green-800 font-semibold"
    : locked
      ? "text-gray-400 cursor-not-allowed"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  const iconClasses = `w-4 h-4 shrink-0 ${active ? "text-green-700" : locked ? "text-gray-400" : "text-gray-500"
    }`;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`${baseClasses} ${stateClasses}`}
    >
      {isLesson ? (
        <BookOpen className={iconClasses} />
      ) : (
        <PencilLine className={iconClasses} />
      )}

      <span className="flex-1 truncate">{item.title}</span>

      {locked ? (
        <Lock className="w-4 h-4 shrink-0 text-gray-400" />
      ) : completed ? (
        <CheckCircle2
          className={`w-4 h-4 shrink-0 ${active ? "text-green-700" : "text-green-500"
            }`}
        />
      ) : null}
    </button>
  );
}

export default React.memo(Item);

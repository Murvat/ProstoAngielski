"use client";

import React from "react";
import type { LessonItem } from "@/types";

function Item({
  item,
  active,
  onClick,
  completed = false,
}: {
  item: LessonItem;
  active: boolean;
  onClick: () => void;
  completed?: boolean;
}) {
  const isLesson = item.type === "lesson";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className={`flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
        ${
          active
            ? "bg-green-50 text-green-700 font-semibold shadow-sm"
            : "hover:bg-gray-50 text-gray-700"
        }
      `}
    >
      {/* Label */}
      <span
        className={`truncate ${
          isLesson
            ? "text-sm font-medium tracking-tight"
            : "text-xs uppercase font-semibold text-gray-500"
        }`}
      >
        {isLesson ? item.title : "Ćwiczenie"}
      </span>

      {/* Progress indicator */}
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-full border text-[10px]
          ${
            completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 bg-white text-gray-400"
          }
        `}
      >
        {completed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </div>
  );
}
export default React.memo(Item);


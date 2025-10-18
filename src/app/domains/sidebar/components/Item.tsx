"use client";

import React from "react";
import { Lock } from "lucide-react";
import type { LessonItem } from "@/types";

type ItemProps = {
  item: LessonItem;
  active: boolean;
  onClick: () => void;
  completed?: boolean;
  locked?: boolean;
};

function Item({
  item,
  active,
  onClick,
  completed = false,
  locked = false,
}: ItemProps) {
  const isLesson = item.type === "lesson";

  const baseClasses =
    "flex justify-between items-center px-4 py-3 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-400";
  const stateClasses = active
    ? "bg-green-50 text-green-700 font-semibold shadow-sm"
    : "text-gray-700 hover:bg-gray-50";
  const lockedClasses = locked
    ? "border border-gray-200 bg-gray-100/60 text-gray-400 cursor-pointer hover:bg-gray-100"
    : "cursor-pointer";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={`${baseClasses} ${stateClasses} ${lockedClasses}`}
      aria-disabled={locked}
    >
      <span
        className={`truncate ${
          isLesson
            ? "text-sm font-medium tracking-tight"
            : "text-xs uppercase font-semibold text-gray-500"
        }`}
      >
        {isLesson ? item.title : "Cwiczenie"}
      </span>

      {locked ? (
        <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
      ) : (
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full border text-[10px]
          ${
            completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 bg-white text-gray-400"
          }
        `}
          aria-hidden={!completed}
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
      )}
    </div>
  );
}

export default React.memo(Item);

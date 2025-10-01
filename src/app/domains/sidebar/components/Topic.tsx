// src/app/domains/sidebar/components/Topic.tsx
"use client";

import { ChevronRight } from "lucide-react";
import type { Chapter } from "../features/types";
import React from "react";

type TopicProps = {
  topic: Pick<Chapter, "id" | "title">; // we only need id + title
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

 function Topic({ topic, isOpen, onToggle, children }: TopicProps) {
  return (
    <div className="flex flex-col">
      {/* Chapter header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex justify-between items-center px-2 py-3 rounded hover:bg-gray-100 cursor-pointer text-lg font-semibold"
        aria-expanded={isOpen}
        aria-controls={`topic-${topic.id}`}
      >
        <span>{topic.title}</span>
        <span
          className={`text-gray-400 text-lg transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          <ChevronRight />
        </span>
      </button>

      {/* Lessons list */}
      {isOpen && (
        <div
          id={`topic-${topic.id}`}
          className="ml-4 mt-2 space-y-3 pr-2"
        >
          {children}
        </div>
      )}
    </div>
  );
}
export default React.memo(Topic);


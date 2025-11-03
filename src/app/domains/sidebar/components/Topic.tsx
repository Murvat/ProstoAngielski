// src/app/domains/sidebar/components/Topic.tsx
"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

type TopicProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function Topic({ title, isOpen, onToggle, children }: TopicProps) {
  return (
    <div className="py-1">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <span className="font-semibold text-base text-gray-800">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0"
          }`}
      >
        <div className="pt-2 pl-4 border-l-2 border-gray-200 ml-4 mt-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Topic);


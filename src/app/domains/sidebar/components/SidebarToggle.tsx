// src/app/domains/sidebar/components/SidebarToggle.tsx
"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function SidebarToggle({
  isOpen,
  label,
  onToggle,
}: {
  isOpen: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <div className="p-3 sticky top-0 z-10 bg-gray-50">
      <button
        onClick={onToggle}
        className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg cursor-pointer ${
          isOpen ? "bg-green-100 hover:bg-green-200" : "hover:bg-gray-100"
        } transition-colors duration-200`}
      >
        <span className="text-2xl">
          {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </span>
        {isOpen && (
          <span className="font-semibold text-lg mx-auto text-center w-full">
            {label}
          </span>
        )}
      </button>
    </div>
  );
}

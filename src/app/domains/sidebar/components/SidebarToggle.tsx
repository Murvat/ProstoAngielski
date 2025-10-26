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
    <button
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-white/90 px-4 py-3 text-left text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:shadow-md ${
        isOpen ? "" : "justify-center"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
        {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
      </span>
      {isOpen && <span className="flex-1 truncate">{label}</span>}
    </button>
  );
}


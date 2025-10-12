"use client";

import { motion } from "framer-motion";
import type { Tab } from "../features/types";

interface ProfileTabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export const ProfileTabs = ({ activeTab, onChange }: ProfileTabsProps) => {
  const tabConfig: { key: Tab; label: string }[] = [
    { key: "kursy", label: "Kursy" },
    { key: "dane", label: "Dane osobiste" },
    { key: "ustalenia", label: "Ustalenia" },
    { key: "platnosci", label: "Płatności" },
    { key: "mobilna", label: "Mobilna aplikacja" },
  ];

  return (
    <div className="relative w-full overflow-x-auto scrollbar-hide mb-6">
      <div className="flex min-w-max justify-between sm:justify-center gap-2 sm:gap-6 border-b border-gray-200 px-2 sm:px-0 pb-2">
        {tabConfig.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative px-4 py-2 text-sm sm:text-base font-semibold transition-all duration-300 rounded-md
                ${
                  isActive
                    ? "text-green-700"
                    : "text-gray-500 hover:text-green-700 hover:bg-green-50/70"
                }`}
            >
              {/* Label */}
              <span className="relative z-10">{tab.label}</span>

              {/* Animated Underline */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-green-600 to-emerald-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

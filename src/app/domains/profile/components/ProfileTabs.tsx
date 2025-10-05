"use client";
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
    <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6">
      {tabConfig.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 text-center px-4 py-2 text-sm sm:text-base font-medium
            transition-all duration-200 cursor-pointer
            ${
              activeTab === tab.key
                ? "border-b-2 border-green-600 text-green-700 bg-green-50"
                : "text-gray-500 hover:text-green-700 hover:bg-green-50/40"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

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
    { key: "mobilna", label: "Mobilna appka" },
  ];

  return (
    <div className="flex flex-col sm:flex-row border-b mb-6">
      {tabConfig.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 text-center px-4 py-2 text-sm sm:text-base font-medium cursor-pointer transition-colors ${
            activeTab === tab.key
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

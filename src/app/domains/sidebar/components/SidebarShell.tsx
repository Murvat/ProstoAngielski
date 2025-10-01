// src/app/domains/sidebar/components/SidebarShell.tsx
"use client";

export default function SidebarShell({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={`relative z-10 flex h-full border-r border-r-gray-200 shrink-0 
        ${isOpen ? "w-80" : "w-16"} 
        transition-all duration-300 bg-gray-50 flex-col overflow-hidden`}
    >
      {children}
    </aside>
  );
}

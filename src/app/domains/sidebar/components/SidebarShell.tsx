"use client";

type SidebarShellProps = {
  isOpen: boolean;
  children: React.ReactNode;
  variant?: "desktop" | "mobile";
  className?: string;
};

export default function SidebarShell({
  isOpen,
  children,
  variant = "desktop",
  className = "",
}: SidebarShellProps) {
  const widthClass =
    variant === "desktop"
      ? isOpen
        ? "w-80"
        : "w-16"
      : "w-full max-w-sm";

  const radiusClass = variant === "mobile" ? "rounded-r-3xl" : "";

  return (
    <aside
      className={`relative z-10 flex h-full shrink-0 flex-col overflow-hidden border-r border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-emerald-50 transition-all duration-300 ${widthClass} ${radiusClass} ${className}`}
    >
      {children}
    </aside>
  );
}


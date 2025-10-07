"use client";

import { useState } from "react";

export function BlogLayout({ html }: { html: string }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const categories = ["Nauka", "Gramatyka", "Motywacja"];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ✅ Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-[20%] md:w-64" : "w-16"
        } bg-white border-r transition-all duration-300 flex flex-col`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className={`flex items-center gap-4 w-full px-4 py-3 border-b transition-colors ${
            isSidebarOpen
              ? "bg-green-100 hover:bg-green-200"
              : "hover:bg-gray-100"
          }`}
        >
          <span className="text-2xl">{isSidebarOpen ? "×" : "☰"}</span>
          {isSidebarOpen && (
            <span className="font-semibold text-lg mx-auto">Blog</span>
          )}
        </button>

        {isSidebarOpen && (
          <nav className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Kategorie
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button className="group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-125 transition-transform"></span>
                        {cat}
                      </span>
                      <span className="text-gray-400 text-xs">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </aside>

      {/* ✅ Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 prose prose-green"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
}

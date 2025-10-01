type TocItem = { id: string; text: string; level: 2 | 3 };

type TocProps = {
  toc: TocItem[];
  activeId: string | null;
};

export default function Toc({ toc, activeId }: TocProps) {
  return (
    <aside className="hidden lg:flex h-full flex-shrink-0 w-72 bg-gray-50 border-l border-l-gray-200 flex-col overflow-y-auto p-4">
      <div className="space-y-2 text-base">
        <h2 className="px-2 pb-2 text-sm font-semibold text-gray-600">
          On this page
        </h2>

        {toc.length === 0 && (
          <p className="text-sm text-gray-500">No headings found</p>
        )}

        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(item.id);
              if (el) {
                window.history.pushState(null, "", `#${item.id}`);
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className={[
              "block rounded px-3 py-2 cursor-pointer transition",
              item.level === 3 ? "ml-4" : "",
              activeId === item.id
                ? "bg-green-200 text-green-900 font-semibold"
                : "hover:bg-green-100 text-gray-800",
            ].join(" ")}
          >
            {item.text}
          </a>
        ))}
      </div>
    </aside>
  );
}

import ReactMarkdown from "react-markdown";
import type { BlogPost } from "@/types";

type AdminBlogListProps = {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: number) => void;
};

export function AdminBlogList({ blogs, onEdit, onDelete }: AdminBlogListProps) {
  if (blogs.length === 0) {
    return (
      <p className="text-gray-500 text-sm">Brak wpisow w bazie danych.</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {blogs.map((blog) => (
        <article
          key={blog.id}
          className="bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4"
        >
          {blog.image_link && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.image_link}
              alt="thumbnail"
              className="w-40 h-28 object-cover rounded-lg border"
            />
          )}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-green-700 mb-2">
              {blog.title || "Bez tytulu"}
            </h3>

            <div className="text-gray-800 line-clamp-4 text-sm">
              <ReactMarkdown>{blog.blog}</ReactMarkdown>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Dodano: {new Date(blog.created_at).toLocaleString("pl-PL")}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onEdit(blog)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Edytuj
            </button>
            <button
              onClick={() => onDelete(blog.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Usun
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

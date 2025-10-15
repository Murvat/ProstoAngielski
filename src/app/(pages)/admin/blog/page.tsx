"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function BlogAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState(""); // ✅ YENİ
  const [imageLink, setImageLink] = useState("");
  const [blogText, setBlogText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔐 Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ✅ Login credentials
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "admin123";

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Nieprawidłowy login lub hasło!");
    }
  }

  // 📦 Fetch blogs
  async function fetchBlogs() {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Błąd przy pobieraniu:", error);
    else setBlogs(data || []);
  }

  useEffect(() => {
    if (isLoggedIn) fetchBlogs();
  }, [isLoggedIn]);

  // 💾 Save / Update blog
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from("blogs")
        .update({ title, image_link: imageLink, blog: blogText })
        .eq("id", editingId);
      if (error) alert("Błąd przy aktualizacji!");
    } else {
      const { error } = await supabase
        .from("blogs")
        .insert([{ title, image_link: imageLink, blog: blogText }]);
      if (error) alert("Błąd przy dodawaniu!");
    }

    setTitle("");
    setImageLink("");
    setBlogText("");
    setEditingId(null);
    setLoading(false);
    fetchBlogs();
  }

  // ✏️ Edit
  function handleEdit(blog: any) {
    setEditingId(blog.id);
    setTitle(blog.title || "");
    setImageLink(blog.image_link);
    setBlogText(blog.blog);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 🗑 Delete
  async function handleDelete(id: number) {
    if (!confirm("Na pewno chcesz usunąć ten wpis?")) return;
    await supabase.from("blogs").delete().eq("id", id);
    fetchBlogs();
  }

  // 👤 Login form
  if (!isLoggedIn) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-md border border-gray-200 w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
            Logowanie administratora
          </h1>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa użytkownika
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasło
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {loginError && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Zaloguj się
          </button>
        </form>
      </section>
    );
  }

  // 🔧 Admin panel
  return (
    <section className="max-w-4xl mx-auto py-12 px-6 flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-green-700 text-center">
        Panel Blog Admin
      </h1>

      {/* ✍️ Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white shadow-lg rounded-xl p-6 border border-gray-100"
      >
        {/* ✅ Title input */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Tytuł wpisu
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wpisz tytuł bloga..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Link do zdjęcia
          </label>
          <input
            type="text"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Treść bloga (Markdown)
          </label>
          <textarea
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
            placeholder="Wpisz treść w formacie Markdown..."
            rows={10}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
          >
            {preview ? "Edytuj" : "Podgląd"}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            {loading
              ? "Zapisywanie..."
              : editingId
              ? "Zaktualizuj wpis"
              : "Dodaj wpis"}
          </button>
        </div>
      </form>

      {/* 👀 Markdown preview */}
      {preview && (
        <div className="p-6 bg-gray-50 border rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Podgląd:</h2>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            <ReactMarkdown>{blogText}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* 📚 Blog list */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-green-700">
          📚 Wszystkie wpisy
        </h2>
        {blogs.length === 0 && (
          <p className="text-gray-500 text-sm">Brak wpisów w bazie danych.</p>
        )}
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4"
          >
            {blog.image_link && (
              <img
                src={blog.image_link}
                alt="thumbnail"
                className="w-40 h-28 object-cover rounded-lg border"
              />
            )}
            <div className="flex-1">
              {/* ✅ Title render */}
              <h3 className="font-bold text-lg text-green-700 mb-2">
                {blog.title || "Bez tytułu"}
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
                onClick={() => handleEdit(blog)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Edytuj
              </button>
              <button
                onClick={() => handleDelete(blog.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

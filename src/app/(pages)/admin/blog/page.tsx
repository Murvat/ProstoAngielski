"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/supabase/queries";
import type { BlogPost } from "@/types";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

type BlogFormState = {
  title: string;
  imageLink: string;
  blogText: string;
};

const initialFormState: BlogFormState = {
  title: "",
  imageLink: "",
  blogText: "",
};

export default function BlogAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogFormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [blogError, setBlogError] = useState<string | null>(null);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError("Niepoprawny login lub haslo.");
    }
  };

  const loadBlogs = async () => {
    const { data, error } = await listBlogs(supabase);
    if (error) {
      console.error("Failed to load blogs:", error);
      setBlogError("Blad podczas ladowania wpisow.");
      return;
    }
    setBlogError(null);
    setBlogs(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadBlogs();
    }
  }, [isLoggedIn]);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setPreview(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.blogText.trim()) {
      setBlogError("Tytul i tresc wpisu sa wymagane.");
      return;
    }

    setLoading(true);
    setBlogError(null);

    const payload = {
      title: form.title.trim(),
      image_link: form.imageLink.trim() || null,
      blog: form.blogText,
    };

    const error = editingId
      ? await updateBlog(supabase, editingId, payload)
      : await createBlog(supabase, payload);

    if (error) {
      console.error("Failed to save blog:", error);
      setBlogError("Nie udalo sie zapisac wpisu.");
    } else {
      resetForm();
      await loadBlogs();
    }

    setLoading(false);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title ?? "",
      imageLink: blog.image_link ?? "",
      blogText: blog.blog ?? "",
    });
    setPreview(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunac ten wpis?")) return;
    const error = await deleteBlog(supabase, id);
    if (error) {
      console.error("Failed to delete blog:", error);
      setBlogError("Nie udalo sie usunac wpisu.");
      return;
    }
    await loadBlogs();
  };

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
            Nazwa uzytkownika
          </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="username"
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Haslo
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {loginError && (
            <p className="text-sm text-red-600 mb-4 text-center">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Zaloguj
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-700">
            Panel blogowy ProstoAngielski
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-green-600 hover:text-green-800"
          >
            Wroc do strony
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Tytul wpisu
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Wpisz tytul bloga..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Link do zdjecia
            </label>
            <input
              type="text"
              value={form.imageLink}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, imageLink: event.target.value }))
              }
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Tresc bloga (Markdown)
            </label>
            <textarea
              value={form.blogText}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, blogText: event.target.value }))
              }
              placeholder="Wpisz tresc w formacie Markdown..."
              rows={10}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
            />
          </div>

          {blogError && (
            <p className="text-sm text-red-600">{blogError}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPreview((value) => !value)}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
            >
              {preview ? "Edytuj" : "Podglad"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-60"
            >
              {loading
                ? "Zapisywanie..."
                : editingId
                ? "Zaktualizuj wpis"
                : "Dodaj wpis"}
            </button>
          </div>
        </form>

        {preview && (
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Podglad:
            </h2>
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              <ReactMarkdown>{form.blogText}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-green-700">
            Wszystkie wpisy
          </h2>
          {blogs.length === 0 && (
            <p className="text-gray-500 text-sm">Brak wpisow w bazie danych.</p>
          )}
          {blogs.map((blog) => (
            <article
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
                  onClick={() => handleEdit(blog)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Usun
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}




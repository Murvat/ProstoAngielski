"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

type BlogFormState = {
  title: string;
  imageLink: string;
  blogText: string;
};

type AdminBlogFormProps = {
  form: BlogFormState;
  preview: boolean;
  editingId: number | null;
  loading: boolean;
  blogError: string | null;
  onChange: (updater: (prev: BlogFormState) => BlogFormState) => void;
  onTogglePreview: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function AdminBlogForm({
  form,
  preview,
  editingId,
  loading,
  blogError,
  onChange,
  onTogglePreview,
  onSubmit,
}: AdminBlogFormProps) {
  const previewTitle = useMemo(
    () => (preview ? "Podglad" : "Edytuj"),
    [preview]
  );

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-5"
    >
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Tytul wpisu
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(event) =>
            onChange((prev) => ({ ...prev, title: event.target.value }))
          }
          placeholder="Wpisz tytul bloga..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Link do zdjecia
        </label>
        <input
          type="url"
          value={form.imageLink}
          onChange={(event) =>
            onChange((prev) => ({ ...prev, imageLink: event.target.value }))
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
            onChange((prev) => ({ ...prev, blogText: event.target.value }))
          }
          placeholder="Wpisz tresc w formacie Markdown..."
          rows={10}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          required
        />
      </div>

      {blogError && <p className="text-sm text-red-600">{blogError}</p>}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onTogglePreview}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
        >
          {preview ? "Edytuj" : previewTitle}
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
    </form>
  );
}

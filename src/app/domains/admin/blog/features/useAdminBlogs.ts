"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/supabase/queries";
import type { BlogPost } from "@/types";

export type BlogFormState = {
  title: string;
  imageLink: string;
  blogText: string;
};

const initialFormState: BlogFormState = {
  title: "",
  imageLink: "",
  blogText: "",
};

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export function useAdminBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogFormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const loadBlogs = useCallback(async () => {
    const { data, error } = await listBlogs(supabase);
    if (error) {
      console.error("Failed to load blogs:", error);
      setBlogError("Blad podczas ladowania wpisow.");
      return;
    }
    setBlogError(null);
    setBlogs(data);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadBlogs();
    }
  }, [isLoggedIn, loadBlogs]);

  const resetForm = useCallback(() => {
    setForm(initialFormState);
    setEditingId(null);
    setPreview(false);
  }, []);

  const handleLogin = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError("Niepoprawny login lub haslo.");
    }
  }, [username, password]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
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
    },
    [editingId, form, loadBlogs, resetForm]
  );

  const handleEdit = useCallback((blog: BlogPost) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title ?? "",
      imageLink: blog.image_link ?? "",
      blogText: blog.blog ?? "",
    });
    setPreview(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Czy na pewno chcesz usunac ten wpis?")) return;
      const error = await deleteBlog(supabase, id);
      if (error) {
        console.error("Failed to delete blog:", error);
        setBlogError("Nie udalo sie usunac wpisu.");
        return;
      }
      await loadBlogs();
    },
    [loadBlogs]
  );

  const togglePreview = useCallback(() => {
    setPreview((value) => !value);
  }, []);

  return {
    blogs,
    form,
    editingId,
    preview,
    loading,
    blogError,
    username,
    password,
    isLoggedIn,
    loginError,
    setForm,
    setUsername,
    setPassword,
    handleLogin,
    handleSubmit,
    handleEdit,
    handleDelete,
    togglePreview,
  };
}

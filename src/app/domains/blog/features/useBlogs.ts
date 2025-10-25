"use client";

import { useState, useEffect } from "react";
import { fetchBlogs, fetchBlogById } from "@/lib/supabase/queries/blogs";
import type { BlogPost } from "@/types";

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const data = await fetchBlogs();
      if (mounted) {
        setBlogs(data);
        setFilteredBlogs(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredBlogs(blogs);
      return;
    }
    const q = search.toLowerCase();
    setFilteredBlogs(blogs.filter((b) => b.title?.toLowerCase().includes(q)));
  }, [search, blogs]);

  return { blogs, filteredBlogs, search, setSearch, loading };
}

export function useBlog(id: number | string | null | undefined) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const numericId =
      typeof id === "string" ? Number(id) : typeof id === "number" ? id : NaN;
    if (!Number.isFinite(numericId)) {
      return;
    }

    async function load() {
      setLoading(true);
      const data = await fetchBlogById(numericId);
      setBlog(data);
      setLoading(false);
    }
    load();
  }, [id]);

  return { blog, loading };
}

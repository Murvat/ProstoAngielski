import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/types";
import { supabase } from "../client/supabaseClient";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;
type BlogRow = Database["public"]["Tables"]["blogs"]["Row"];

type BlogInput = {
  title: string;
  image_link: string | null;
  blog: string;
};

const normalizeBlog = (record: BlogRow): BlogPost => ({
  id: record.id,
  title: record.title,
  image_link: record.image_link ?? null,
  blog: record.blog,
  created_at: record.created_at ?? new Date().toISOString(),
});

export async function listBlogs(
  client: Client
): Promise<{ data: BlogPost[]; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error };
  }

  const rows = (data ?? []) as BlogRow[];
  return { data: rows.map(normalizeBlog), error: null };
}

export async function createBlog(
  client: Client,
  payload: BlogInput
): Promise<PostgrestError | null> {
  const { error } = await client.from("blogs").insert([payload]);
  return error ?? null;
}

export async function updateBlog(
  client: Client,
  id: number,
  payload: BlogInput
): Promise<PostgrestError | null> {
  const { error } = await client.from("blogs").update(payload).eq("id", id);
  return error ?? null;
}

export async function deleteBlog(
  client: Client,
  id: number
): Promise<PostgrestError | null> {
  const { error } = await client.from("blogs").delete().eq("id", id);
  return error ?? null;
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, image_link, blog, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (data ?? []) as BlogRow[];
    return rows.map(normalizeBlog);
  } catch (err) {
    console.error("[Supabase] fetchBlogs error:", err);
    return [];
  }
}

export async function fetchBlogById(id: string | number): Promise<BlogPost | null> {
  const blogId = typeof id === "string" ? Number(id) : id;
  if (!Number.isFinite(blogId)) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, image_link, blog, created_at")
      .eq("id", blogId)
      .maybeSingle();

    if (error) throw error;
    return data ? normalizeBlog(data as BlogRow) : null;
  } catch (err) {
    console.error("[Supabase] fetchBlogById error:", err);
    return null;
  }
}

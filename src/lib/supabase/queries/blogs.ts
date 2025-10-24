import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/types";
import { supabase } from "../client/supabaseClient";
type Client = SupabaseClient<any, "public", any>;

type BlogInput = {
  title: string;
  image_link: string | null;
  blog: string;
};

function normalizeBlog(record: Record<string, any>): BlogPost {
  return {
    id: record.id,
    title: record.title ?? "",
    image_link: record.image_link ?? null,
    blog: record.blog ?? "",
    created_at: record.created_at ?? new Date().toISOString(),
  };
}

export async function listBlogs(
  client: Client
): Promise<{ data: BlogPost[]; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { data: [], error };
  }

  return { data: data.map(normalizeBlog), error: null };
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
      .select("id, title, image_link, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as any || [];
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return [];
  }
}

export async function fetchBlogById(id: string | number) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, image_link, blog, created_at")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("❌ fetchBlogById error:", err);
    return null;
  }
}

// News/updates service for Family Reunion
import { supabase } from "@/integrations/supabase/client";

export interface ReunionNewsItem {
  id: string;
  author_code: string;
  author_name: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
}

const TABLE = "reunion_news";

export async function getNews(): Promise<ReunionNewsItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE as any)
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false }) as any;
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function postNews({
  authorCode,
  authorName,
  title,
  body,
  pinned,
}: {
  authorCode: string;
  authorName: string;
  title: string;
  body: string;
  pinned?: boolean;
}): Promise<ReunionNewsItem> {
  const { data, error } = await supabase
    .from(TABLE as any)
    .insert({
      author_code: authorCode,
      author_name: authorName,
      title,
      body,
      pinned: pinned ?? false,
    } as any)
    .select("*")
    .single() as any;
  if (error) throw new Error("Failed to post update: " + error.message);
  return data;
}

export async function deleteNews(id: string): Promise<void> {
  await supabase.from(TABLE as any).delete().eq("id", id);
}

export async function togglePin(id: string, pinned: boolean): Promise<void> {
  await supabase.from(TABLE as any).update({ pinned } as any).eq("id", id);
}

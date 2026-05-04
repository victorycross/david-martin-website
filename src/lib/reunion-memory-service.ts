import { supabase } from "@/integrations/supabase/client";

export interface ReunionMemory {
  id: string;
  author_code: string;
  author_name: string;
  content: string;
  photo_path: string | null;
  photo_url: string | null;
  created_at: string;
}

const TABLE = "reunion_memories";
const BUCKET = "reunion-photos";

export async function getMemories(): Promise<ReunionMemory[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE as any)
      .select("*")
      .order("created_at", { ascending: false }) as any;
    if (error || !data) return [];
    return data.map((row: any) => ({
      ...row,
      photo_url: row.photo_path
        ? supabase.storage.from(BUCKET).getPublicUrl(row.photo_path).data.publicUrl
        : null,
    }));
  } catch {
    return [];
  }
}

export async function addMemory({
  authorCode,
  authorName,
  content,
  photoFile,
}: {
  authorCode: string;
  authorName: string;
  content: string;
  photoFile?: File;
}): Promise<ReunionMemory> {
  let photo_path: string | null = null;

  if (photoFile) {
    if (!photoFile.type.startsWith("image/")) throw new Error("Only image files are allowed");
    if (photoFile.size > 10 * 1024 * 1024) throw new Error("File must be under 10 MB");
    const ext = photoFile.name.split(".").pop() || "jpg";
    photo_path = `memories/${authorCode}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(photo_path, photoFile, { contentType: photoFile.type });
    if (uploadError) throw new Error("Photo upload failed: " + uploadError.message);
  }

  const { data, error } = await supabase
    .from(TABLE as any)
    .insert({ author_code: authorCode, author_name: authorName, content, photo_path } as any)
    .select("*")
    .single() as any;

  if (error) throw new Error("Failed to save memory: " + error.message);

  return {
    ...data,
    photo_url: photo_path
      ? supabase.storage.from(BUCKET).getPublicUrl(photo_path).data.publicUrl
      : null,
  };
}

export async function deleteMemory(id: string, photoPath: string | null): Promise<void> {
  if (photoPath) {
    await supabase.storage.from(BUCKET).remove([photoPath]);
  }
  await supabase.from(TABLE as any).delete().eq("id", id);
}

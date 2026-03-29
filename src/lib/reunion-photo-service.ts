// Photo gallery service for Family Reunion
// Handles upload, listing, and deletion of photos via Supabase Storage + table.

import { supabase } from "@/integrations/supabase/client";

export interface ReunionPhoto {
  id: string;
  uploader_code: string;
  uploader_name: string;
  file_path: string;
  caption: string | null;
  created_at: string;
  public_url: string;
}

const BUCKET = "reunion-photos";
const TABLE = "reunion_photos";

export async function getPhotos(): Promise<ReunionPhoto[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE as any)
      .select("*")
      .order("created_at", { ascending: false }) as any;

    if (error || !data) return [];

    return data.map((row: any) => ({
      ...row,
      public_url: supabase.storage
        .from(BUCKET)
        .getPublicUrl(row.file_path).data.publicUrl,
    }));
  } catch {
    return [];
  }
}

export async function uploadPhoto({
  file,
  uploaderCode,
  uploaderName,
  caption,
}: {
  file: File;
  uploaderCode: string;
  uploaderName: string;
  caption?: string;
}): Promise<ReunionPhoto> {
  // Validate
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File must be under 10MB");
  }

  // Upload to storage
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${uploaderCode}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { contentType: file.type });

  if (uploadError) throw new Error("Upload failed: " + uploadError.message);

  // Insert metadata
  const { data, error: insertError } = await supabase
    .from(TABLE as any)
    .insert({
      uploader_code: uploaderCode,
      uploader_name: uploaderName,
      file_path: filePath,
      caption: caption || null,
    } as any)
    .select("*")
    .single() as any;

  if (insertError) throw new Error("Failed to save photo data: " + insertError.message);

  return {
    ...data,
    public_url: supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath).data.publicUrl,
  };
}

export async function deletePhoto(id: string): Promise<void> {
  // Get file path first
  const { data, error } = await supabase
    .from(TABLE as any)
    .select("file_path")
    .eq("id", id)
    .single() as any;

  if (error || !data) throw new Error("Photo not found");

  // Delete from storage
  await supabase.storage.from(BUCKET).remove([data.file_path]);

  // Delete from table
  await supabase.from(TABLE as any).delete().eq("id", id);
}

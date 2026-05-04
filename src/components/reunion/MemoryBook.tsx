import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isAdmin, type FamilyMember } from "@/data/reunion-config";
import { getMemories, addMemory, deleteMemory, type ReunionMemory } from "@/lib/reunion-memory-service";
import { Textarea } from "@/components/ui/textarea";

interface MemoryBookProps {
  member: FamilyMember;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MemoryBook({ member }: MemoryBookProps) {
  const { toast } = useToast();
  const [memories, setMemories] = useState<ReunionMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [content, setContent] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const admin = isAdmin(member);

  useEffect(() => {
    getMemories().then((data) => {
      setMemories(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const memory = await addMemory({
        authorCode: member.code,
        authorName: member.name,
        content: content.trim(),
        photoFile: photoFile ?? undefined,
      });
      setMemories((prev) => [memory, ...prev]);
      setContent("");
      setPhotoFile(null);
      setFormOpen(false);
      toast({ title: "Memory shared", description: "Your memory has been added to the book." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (memory: ReunionMemory) => {
    setConfirmingDelete(null);
    setDeleting(memory.id);
    try {
      await deleteMemory(memory.id, memory.photo_path);
      setMemories((prev) => prev.filter((m) => m.id !== memory.id));
    } catch {
      toast({ title: "Error", description: "Could not delete memory.", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />
      <div className="relative z-10 max-w-2xl mx-auto">

        <div className="text-center mb-8 pt-2">
          <h2 className="reunion-heading text-2xl mb-1">Memory Book</h2>
          <p className="reunion-body text-sm opacity-50">Stories and moments from May 3, 2026</p>
        </div>

        {/* Add a memory */}
        {!formOpen ? (
          <button
            onClick={() => setFormOpen(true)}
            className="reunion-button-outline w-full py-3 rounded-lg text-sm mb-8 flex items-center justify-center gap-2"
          >
            <span className="opacity-70">&#9998;</span>
            Share a Memory
          </button>
        ) : (
          <div className="reunion-card p-6 mb-8">
            <h3 className="reunion-heading text-base mb-4">Share a Memory</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a story, a moment, or something that made you smile on May 3rd…"
                className="reunion-input min-h-32 resize-y"
                autoFocus
              />
              <div>
                <label className="reunion-label text-xs block mb-2">
                  Attach a photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  className="text-xs reunion-body opacity-70 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:reunion-button-outline"
                />
                {photoFile && (
                  <p className="text-xs reunion-body opacity-40 mt-1">{photoFile.name}</p>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <button
                  type="submit"
                  disabled={!content.trim() || submitting}
                  className="reunion-button px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                >
                  {submitting ? "Saving…" : "Share Memory"}
                </button>
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); setContent(""); setPhotoFile(null); }}
                  className="reunion-body text-xs opacity-50 hover:opacity-80 transition-opacity underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <p className="reunion-body text-sm opacity-40 text-center py-16">Loading memories…</p>
        ) : memories.length === 0 ? (
          <div className="text-center py-16">
            <p className="reunion-body text-sm opacity-40 mb-1">No memories shared yet.</p>
            <p className="reunion-body text-xs opacity-30">Be the first to add one above.</p>
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            {memories.map((memory) => (
              <div key={memory.id} className="reunion-card p-6 sm:p-8">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="reunion-heading text-base">{memory.author_name}</span>
                    <span className="reunion-body text-xs opacity-35">{formatDate(memory.created_at)}</span>
                  </div>
                  {(admin || memory.author_code === member.code) && (
                    deleting === memory.id ? (
                      <span className="reunion-body text-xs opacity-40 ml-2">Deleting…</span>
                    ) : confirmingDelete === memory.id ? (
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        <button
                          onClick={() => handleDeleteConfirm(memory)}
                          className="px-2 py-0.5 rounded text-xs bg-red-700 hover:bg-red-600 text-white transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmingDelete(null)}
                          className="reunion-body text-xs opacity-50 hover:opacity-80 underline transition-opacity"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingDelete(memory.id)}
                        className="reunion-body text-base opacity-25 hover:opacity-60 hover:text-red-400 transition-all leading-none ml-2 shrink-0"
                        title="Delete"
                      >
                        ×
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-800/20 to-transparent" />
                </div>

                <p className="reunion-body text-sm leading-relaxed opacity-80 whitespace-pre-wrap">
                  {memory.content}
                </p>

                {memory.photo_url && (
                  <div className="mt-5 rounded-lg overflow-hidden">
                    <img
                      src={memory.photo_url}
                      alt={`Photo by ${memory.author_name}`}
                      className="w-full object-cover max-h-96"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

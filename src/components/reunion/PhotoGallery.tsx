import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { eventDetails, isAdmin, type FamilyMember } from "@/data/reunion-config";
import { getPhotos, deletePhoto, type ReunionPhoto } from "@/lib/reunion-photo-service";
import { PhotoUpload } from "./PhotoUpload";

interface PhotoGalleryProps {
  member: FamilyMember;
}

export function PhotoGallery({ member }: PhotoGalleryProps) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<ReunionPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<ReunionPhoto | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const admin = isAdmin(member);

  const loadPhotos = useCallback(async () => {
    const data = await getPhotos();
    setPhotos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleDelete = async (photo: ReunionPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete this photo${photo.caption ? ` ("${photo.caption}")` : ""}?`)) return;

    setDeleting(photo.id);
    try {
      await deletePhoto(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
      toast({ title: "Photo deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="reunion-title text-3xl sm:text-4xl mb-1">Photos</h1>
          <p className="reunion-subtitle text-sm tracking-widest uppercase">
            {eventDetails.title}
          </p>
        </div>

        {/* Upload */}
        <PhotoUpload
          memberCode={member.code}
          memberName={member.name}
          onUploadSuccess={loadPhotos}
        />

        {/* Gallery */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="reunion-body text-sm opacity-50">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-20">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="reunion-heading text-lg opacity-40">No photos yet</p>
            <p className="reunion-body text-sm opacity-30 mt-1">
              Be the first to share a memory!
            </p>
          </div>
        ) : (
          <div className="reunion-photo-grid">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="reunion-photo-card"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="reunion-photo-img-wrap">
                  <img
                    src={photo.public_url}
                    alt={photo.caption || "Reunion photo"}
                    loading="lazy"
                  />
                  {admin && (
                    <button
                      className="reunion-photo-delete"
                      onClick={(e) => handleDelete(photo, e)}
                      disabled={deleting === photo.id}
                      title="Delete photo"
                    >
                      {deleting === photo.id ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                <div className="p-3">
                  {photo.caption && (
                    <p className="reunion-photo-caption">{photo.caption}</p>
                  )}
                  <p className="reunion-photo-meta">
                    {photo.uploader_name} &middot;{" "}
                    {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="reunion-dialog max-w-3xl p-2 sm:p-4">
          {selectedPhoto && (
            <div>
              <img
                src={selectedPhoto.public_url}
                alt={selectedPhoto.caption || "Reunion photo"}
                className="w-full rounded-lg max-h-[70vh] object-contain"
              />
              <div className="p-3">
                {selectedPhoto.caption && (
                  <p className="reunion-heading text-sm mb-1">{selectedPhoto.caption}</p>
                )}
                <p className="reunion-body text-xs opacity-50">
                  Shared by {selectedPhoto.uploader_name} &middot;{" "}
                  {new Date(selectedPhoto.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

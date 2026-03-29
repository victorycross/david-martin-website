import { useState, useEffect, useCallback, useRef } from "react";
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
  const [deleting, setDeleting] = useState<string | null>(null);
  const admin = isAdmin(member);

  // Carousel state
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPhotos = useCallback(async () => {
    const data = await getPhotos();
    setPhotos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Open carousel at specific photo
  const openCarousel = (index: number) => {
    setCurrentIndex(index);
    setCarouselOpen(true);
  };

  // Start slideshow (auto-play from first photo)
  const startSlideshow = () => {
    setCurrentIndex(0);
    setAutoPlay(true);
    setCarouselOpen(true);
  };

  // Navigation
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const closeCarousel = () => {
    setCarouselOpen(false);
    setAutoPlay(false);
  };

  // Auto-play interval
  useEffect(() => {
    if (autoPlay && carouselOpen && photos.length > 1) {
      autoPlayRef.current = setInterval(goNext, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, carouselOpen, goNext, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!carouselOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      else if (e.key === "Escape") closeCarousel();
      else if (e.key === "p" || e.key === "P") setAutoPlay((a) => !a);
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [carouselOpen, goNext, goPrev]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleDelete = async (photo: ReunionPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete this photo${photo.caption ? ` ("${photo.caption}")` : ""}?`)) return;

    setDeleting(photo.id);
    try {
      await deletePhoto(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      toast({ title: "Photo deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="reunion-title text-3xl sm:text-4xl mb-1">Photos</h1>
            <p className="reunion-subtitle text-sm tracking-widest uppercase">
              {eventDetails.title}
            </p>
          </div>
          {photos.length > 0 && (
            <button
              onClick={startSlideshow}
              className="reunion-button-outline inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
              Slideshow
            </button>
          )}
        </div>

        {/* Upload */}
        <PhotoUpload
          memberCode={member.code}
          memberName={member.name}
          onUploadSuccess={loadPhotos}
        />

        {/* Gallery grid */}
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
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className="reunion-photo-card"
                onClick={() => openCarousel(i)}
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

      {/* ── Fullscreen Carousel / Lightbox ── */}
      {carouselOpen && currentPhoto && (
        <div
          ref={containerRef}
          className="reunion-carousel"
          onClick={closeCarousel}
        >
          {/* Photo */}
          <div
            className="reunion-carousel-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={currentPhoto.id}
              src={currentPhoto.public_url}
              alt={currentPhoto.caption || "Reunion photo"}
              className="reunion-carousel-img"
            />

            {/* Caption overlay */}
            <div className="reunion-carousel-caption">
              {currentPhoto.caption && (
                <p className="reunion-heading text-base sm:text-lg mb-1">
                  {currentPhoto.caption}
                </p>
              )}
              <p className="reunion-body text-xs sm:text-sm opacity-50">
                Shared by {currentPhoto.uploader_name} &middot;{" "}
                {currentIndex + 1} of {photos.length}
              </p>
            </div>
          </div>

          {/* Prev / Next arrows */}
          {photos.length > 1 && (
            <>
              <button
                className="reunion-carousel-arrow reunion-carousel-arrow-left"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="reunion-carousel-arrow reunion-carousel-arrow-right"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Top controls */}
          <div
            className="reunion-carousel-controls"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Auto-play toggle */}
            <button
              onClick={() => setAutoPlay((a) => !a)}
              className={`reunion-carousel-ctrl-btn ${autoPlay ? "reunion-carousel-ctrl-active" : ""}`}
              title={autoPlay ? "Pause slideshow (P)" : "Play slideshow (P)"}
            >
              {autoPlay ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="reunion-carousel-ctrl-btn"
              title="Fullscreen (F)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={closeCarousel}
              className="reunion-carousel-ctrl-btn"
              title="Close (Esc)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Progress dots */}
          {photos.length > 1 && photos.length <= 20 && (
            <div className="reunion-carousel-dots" onClick={(e) => e.stopPropagation()}>
              {photos.map((_, i) => (
                <button
                  key={i}
                  className={`reunion-carousel-dot ${i === currentIndex ? "reunion-carousel-dot-active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

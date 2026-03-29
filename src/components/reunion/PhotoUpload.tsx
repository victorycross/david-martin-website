import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadPhoto } from "@/lib/reunion-photo-service";

interface PhotoUploadProps {
  memberCode: string;
  memberName: string;
  onUploadSuccess: () => void;
}

export function PhotoUpload({ memberCode, memberName, onUploadSuccess }: PhotoUploadProps) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadPhoto({
        file,
        uploaderCode: memberCode,
        uploaderName: memberName,
        caption: caption.trim() || undefined,
      });
      toast({ title: "Photo uploaded!", description: "Your photo has been added to the gallery." });
      setFile(null);
      setPreview(null);
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      onUploadSuccess();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="reunion-card p-5 mb-6">
      {!preview ? (
        <div
          className={`reunion-dropzone ${dragOver ? "reunion-dropzone-active" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragEnter={() => setDragOver(true)}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-40">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <p className="reunion-body text-sm opacity-60">
            Drop a photo here or <span className="text-amber-500 underline">browse</span>
          </p>
          <p className="reunion-body text-xs opacity-30 mt-1">Images up to 10MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      ) : (
        <div>
          <div className="relative mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg"
            />
            <button
              onClick={reset}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-colors"
            >
              &times;
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="reunion-label mb-1 block">
                Caption <span className="opacity-50">(optional)</span>
              </Label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="reunion-input"
                maxLength={200}
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="reunion-button w-full"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Upload Photo"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

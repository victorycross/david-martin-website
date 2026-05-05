import { useState } from "react";
import { isAdmin, type FamilyMember } from "@/data/reunion-config";
import { PhotoGallery } from "./PhotoGallery";
import { MemoryBook } from "./MemoryBook";

type Tab = "memories" | "photos";

interface ReunionPortalProps {
  member: FamilyMember;
  onBack: () => void;
  onShowAdmin: () => void;
}

export function ReunionPortal({ member, onBack, onShowAdmin }: ReunionPortalProps) {
  const [tab, setTab] = useState<Tab>("memories");
  const admin = isAdmin(member);

  return (
    <div className="reunion-page min-h-screen">
      <div className="reunion-grain" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-10">

        {/* Header */}
        <div className="text-center mb-8 pt-2">
          <div className="reunion-flourish mx-auto mb-4">&#10045;</div>
          <h1 className="reunion-title text-3xl sm:text-4xl mb-2">
            2026 Family Reunion
          </h1>
          <p className="reunion-subtitle text-sm tracking-widest uppercase">
            May 3, 2026 &nbsp;&middot;&nbsp; Collingwood, Ontario
          </p>
        </div>

        {/* Tab bar + controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="reunion-view-toggle">
            <button
              onClick={() => setTab("memories")}
              className={`reunion-view-btn ${tab === "memories" ? "reunion-view-btn-active" : ""}`}
            >
              Memories
            </button>
            <button
              onClick={() => setTab("photos")}
              className={`reunion-view-btn ${tab === "photos" ? "reunion-view-btn-active" : ""}`}
            >
              Photos
            </button>
          </div>
          <div className="flex items-center gap-3">
            {admin && (
              <button
                onClick={onShowAdmin}
                className="reunion-button-outline px-3 py-1.5 rounded-lg text-xs"
              >
                Admin
              </button>
            )}
            <button
              onClick={onBack}
              className="reunion-body text-xs opacity-50 hover:opacity-80 transition-opacity underline"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Tab content */}
        {tab === "memories" ? (
          <MemoryBook member={member} />
        ) : (
          <PhotoGallery member={member} />
        )}

      </div>
    </div>
  );
}

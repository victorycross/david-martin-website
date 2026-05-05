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

        {/* Thank-you letter */}
        <div className="reunion-card p-6 sm:p-10 mb-8">
          <p className="reunion-body text-sm mb-5 opacity-80">Dear Family,</p>

          <p className="reunion-body text-sm leading-relaxed opacity-80 mb-4">
            What a truly special afternoon May 3rd turned out to be. Gathered
            together on the second floor at Kelsey&rsquo;s, surrounded by familiar
            faces and the warmth that only family can bring &mdash; it was a day none
            of us will soon forget.
          </p>

          <p className="reunion-body text-sm leading-relaxed opacity-80 mb-4">
            From the laughter over dinner to the stories shared during open mic
            time, the afternoon was everything we had hoped for and more. Seeing
            cousins reconnect, generations come together, and old memories resurface
            reminded us all just how fortunate we are to have one another.
          </p>

          <p className="reunion-body text-sm leading-relaxed opacity-80 mb-4">
            A heartfelt thank-you to{" "}
            <strong className="opacity-100">Ken and Carmen</strong>, whose vision
            and generosity sparked this gathering. You saw the importance of
            bringing us all together and made it happen &mdash; and for that, we are
            deeply grateful.
          </p>

          <p className="reunion-body text-sm leading-relaxed opacity-80 mb-6">
            Equal thanks to{" "}
            <strong className="opacity-100">Ken Jr. and Beth</strong>, who took
            that vision and turned it into a reality. Your tireless efforts in
            organizing every detail &mdash; from the venue and the menu to making sure
            every family member had their invitation &mdash; did not go unnoticed.
            This reunion was truly a gift, and it was yours to give.
          </p>

          <p className="reunion-body text-sm leading-relaxed opacity-80 mb-6">
            To everyone who made the journey to Collingwood &mdash; thank you. Whether
            near or far, your presence made the day complete. We hope the photos
            and memories shared here will keep the spirit of this reunion alive
            until we can do it all again.
          </p>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />
            <span className="reunion-flourish text-sm">&#10045;</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />
          </div>

          <p className="reunion-body text-sm opacity-50 italic">With love,</p>
          <p className="reunion-body text-sm opacity-50">
            The Jorgensen &amp; Martin Family
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

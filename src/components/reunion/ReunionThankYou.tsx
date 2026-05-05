import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FamilyMember } from "@/data/reunion-config";
import { getAllMembers } from "@/data/reunion-data";

interface ReunionThankYouProps {
  onAuthenticate: (member: FamilyMember) => void;
  onEnterPortal: () => void;
  currentMember?: FamilyMember | null;
}

export function ReunionThankYou({ onAuthenticate, onEnterPortal, currentMember }: ReunionThankYouProps) {
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    getAllMembers().then(setAllMembers);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = allMembers.find(
      (m) => m.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (member) {
      // Stay on the thank-you page — just reveal the Continue shortcut
      setCode("");
      setError("");
      setFormOpen(false);
      onAuthenticate(member); // stores member in parent state without navigating
    } else {
      setError("Code not recognized. Please check your invitation.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 pt-8">
          <div className="reunion-flourish mx-auto mb-6">&#10045;</div>
          <h1 className="reunion-title text-4xl sm:text-5xl mb-3">
            2026 Family Reunion
          </h1>
          <p className="reunion-subtitle text-base tracking-widest uppercase mb-2">
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

        {/* Family memories portal */}
        <div className="reunion-card p-6 sm:p-8 mb-8">
          <h2 className="reunion-heading text-xl mb-2">Family Memories</h2>
          <p className="reunion-body text-sm opacity-70 mb-6">
            View photos, share stories, and add to our Memory Book. Enter your
            personal access code to continue.
          </p>

          {currentMember ? (
            <div className="flex items-center gap-4">
              <button
                onClick={onEnterPortal}
                className="reunion-button px-5 py-2.5 rounded-lg text-sm"
              >
                Continue as {currentMember.name}
              </button>
              <button
                onClick={() => setFormOpen((v) => !v)}
                className="reunion-body text-xs opacity-50 hover:opacity-80 transition-opacity underline"
              >
                Use a different code
              </button>
            </div>
          ) : !formOpen ? (
            <button
              onClick={() => setFormOpen(true)}
              className="reunion-button px-5 py-2.5 rounded-lg text-sm"
            >
              Access Family Memories
            </button>
          ) : null}

          {(formOpen || !currentMember) && (
            <form onSubmit={handleSubmit} className={`space-y-4 max-w-sm ${currentMember ? "mt-4" : ""}`}>
              <div className="space-y-2">
                <Label htmlFor="access-code" className="reunion-label">
                  Access Code
                </Label>
                <Input
                  id="access-code"
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(""); }}
                  placeholder="e.g. ingrid2026"
                  className={`reunion-input ${isShaking ? "reunion-shake" : ""}`}
                  autoFocus={formOpen}
                  autoComplete="off"
                />
                {error && (
                  <p className="text-sm text-red-400 reunion-body">{error}</p>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <button
                  type="submit"
                  className="reunion-button px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                  disabled={!code.trim()}
                >
                  Continue
                </button>
                {(currentMember || formOpen) && (
                  <button
                    type="button"
                    onClick={() => { setFormOpen(false); setCode(""); setError(""); }}
                    className="reunion-body text-xs opacity-50 hover:opacity-80 transition-opacity underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Discreet footer */}
        <div className="text-center pb-10">
          <p className="reunion-body text-xs opacity-20">
            &copy; 2026 The Jorgensen &amp; Martin Family
          </p>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FamilyMember } from "@/data/reunion-config";
import { getAllMembers } from "@/data/reunion-data";

interface ReunionThankYouProps {
  onEnterPortal: (member: FamilyMember) => void;
  currentMember?: FamilyMember | null;
}

export function ReunionThankYou({ onEnterPortal, currentMember }: ReunionThankYouProps) {
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
      onEnterPortal(member);
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

        {/* Access card */}
        <div className="reunion-card p-6 sm:p-10 mb-8">
          <h2 className="reunion-heading text-xl mb-2">Family Memories</h2>
          <p className="reunion-body text-sm opacity-70 mb-6">
            View photos, share stories, and read our thank-you letter. Enter
            your personal access code to continue.
          </p>

          {currentMember && !formOpen ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onEnterPortal(currentMember)}
                className="reunion-button px-5 py-2.5 rounded-lg text-sm"
              >
                Continue as {currentMember.name}
              </button>
              <button
                onClick={() => setFormOpen(true)}
                className="reunion-body text-xs opacity-50 hover:opacity-80 transition-opacity underline"
              >
                Use a different code
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
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
                  autoFocus
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
                {currentMember && (
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

        <div className="text-center pb-10">
          <p className="reunion-body text-xs opacity-20">
            &copy; 2026 The Jorgensen &amp; Martin Family
          </p>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { familyMembers, eventDetails, type FamilyMember } from "@/data/reunion-config";
import { getAllMembers } from "@/data/reunion-data";

interface ReunionLoginProps {
  onLogin: (member: FamilyMember) => void;
}

export function ReunionLogin({ onLogin }: ReunionLoginProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [allMembers, setAllMembers] = useState<FamilyMember[]>(familyMembers);

  // Load dynamic members on mount
  useEffect(() => {
    getAllMembers().then(setAllMembers);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = allMembers.find(
      (m) => m.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (member) {
      setError("");
      onLogin(member);
    } else {
      setError("Code not recognized. Please check your invitation.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="reunion-page min-h-screen flex items-center justify-center p-4">
      {/* Decorative grain overlay */}
      <div className="reunion-grain" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header flourish */}
        <div className="text-center mb-10">
          <div className="reunion-flourish mx-auto mb-6">&#10045;</div>
          <h1 className="reunion-title text-4xl sm:text-5xl mb-3">
            {eventDetails.title}
          </h1>
          <p className="reunion-subtitle text-lg tracking-widest uppercase">
            You&rsquo;re Invited
          </p>
        </div>

        {/* Login card */}
        <div className="reunion-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="reunion-heading text-xl mb-2">
              Enter Your Access Code
            </h2>
            <p className="reunion-body text-sm opacity-70">
              Check your invitation email for your personal code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="access-code" className="reunion-label">
                Access Code
              </Label>
              <Input
                id="access-code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="e.g. ingrid2026"
                className={`reunion-input ${isShaking ? "reunion-shake" : ""}`}
                autoFocus
                autoComplete="off"
              />
              {error && (
                <p className="text-sm text-red-400 mt-1 reunion-body">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="reunion-button w-full"
              disabled={!code.trim()}
            >
              View My RSVP
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="reunion-body text-xs opacity-50">
              {eventDetails.date} &middot; {eventDetails.time}
            </p>
            <p className="reunion-body text-xs opacity-50 mt-1">
              {eventDetails.location} &mdash; {eventDetails.address}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <p className="text-center reunion-body text-xs opacity-40 mt-6">
          Questions? Reach out to{" "}
          <a
            href={`mailto:${eventDetails.contactEmail}`}
            className="underline hover:opacity-80 transition-opacity"
          >
            {eventDetails.contactEmail}
          </a>{" "}
          or call {eventDetails.contactPhone}
        </p>
      </div>
    </div>
  );
}

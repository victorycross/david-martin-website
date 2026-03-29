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

  // Load dynamic members and check for ?code= auto-login
  useEffect(() => {
    getAllMembers().then((members) => {
      setAllMembers(members);
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get("code");
      if (codeParam) {
        const member = members.find(
          (m) => m.code.toLowerCase() === codeParam.trim().toLowerCase()
        );
        if (member) {
          window.history.replaceState(null, "", window.location.pathname);
          onLogin(member);
        } else {
          setCode(codeParam);
          setError("Code not recognized. Please check your invitation.");
        }
      }
    });
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
    <div className="reunion-page min-h-screen py-8 px-4">
      {/* Decorative grain overlay */}
      <div className="reunion-grain" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header flourish */}
        <div className="text-center mb-10 pt-8">
          <div className="reunion-flourish mx-auto mb-6">&#10045;</div>
          <h1 className="reunion-title text-4xl sm:text-5xl mb-3">
            {eventDetails.title}
          </h1>
          <p className="reunion-subtitle text-lg tracking-widest uppercase mb-6">
            Join Us for a Memorable Gathering
          </p>
        </div>

        {/* Invitation letter */}
        <div className="reunion-card p-6 sm:p-8 mb-8">
          <p className="reunion-body text-sm mb-4 opacity-80">Dear Family,</p>
          <p className="reunion-body text-sm leading-relaxed opacity-80">
            We are excited to invite you to our upcoming Family Reunion!
            It&rsquo;s been far too long since we&rsquo;ve all gathered together,
            and we&rsquo;re looking forward to reconnecting, sharing stories,
            and making new memories.
          </p>
        </div>

        {/* Event details card */}
        <div className="reunion-card p-6 sm:p-8 mb-6">
          <h2 className="reunion-heading text-xl mb-4">Event Details</h2>
          <div className="space-y-2 reunion-body text-sm">
            <p>
              <span className="reunion-label text-xs mr-2">Date</span>
              <span className="opacity-80">{eventDetails.date}</span>
            </p>
            <p>
              <span className="reunion-label text-xs mr-2">Time</span>
              <span className="opacity-80">{eventDetails.time}</span>
            </p>
            <p>
              <span className="reunion-label text-xs mr-2">Location</span>
              <span className="opacity-80">
                {eventDetails.location}, {eventDetails.address}
              </span>
            </p>
          </div>
        </div>

        {/* Agenda + What to Bring side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="reunion-card p-6">
            <h2 className="reunion-heading text-lg mb-3">Agenda</h2>
            <div className="space-y-2 reunion-body text-sm opacity-80">
              <div className="flex gap-3">
                <span className="reunion-label text-xs whitespace-nowrap mt-0.5">3&ndash;4pm</span>
                <span>Gathering / Socializing</span>
              </div>
              <div className="flex gap-3">
                <span className="reunion-label text-xs whitespace-nowrap mt-0.5">4&ndash;6pm</span>
                <span>Dinner and Dessert</span>
              </div>
              <div className="flex gap-3">
                <span className="reunion-label text-xs whitespace-nowrap mt-0.5">6&ndash;7pm</span>
                <span>Open Mic Time</span>
              </div>
            </div>
          </div>

          <div className="reunion-card p-6">
            <h2 className="reunion-heading text-lg mb-3">What to Bring</h2>
            <p className="reunion-body text-sm opacity-80">
              Any family memories or stories you&rsquo;d like to share during
              open mic time from 6&ndash;7pm
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="reunion-card p-6 sm:p-8 mb-8">
          <h2 className="reunion-heading text-lg mb-3">Additional Information</h2>
          <ul className="space-y-2 reunion-body text-sm opacity-80">
            <li className="flex gap-2">
              <span className="opacity-50">&#x2022;</span>
              Parking is available onsite.
            </li>
            <li className="flex gap-2">
              <span className="opacity-50">&#x2022;</span>
              Dress comfortably and bring your smiles!
            </li>
            <li className="flex gap-2">
              <span className="opacity-50">&#x2022;</span>
              Non-alcoholic beverages included, beverages with alcohol available for purchase.
            </li>
            <li className="flex gap-2">
              <span className="opacity-50">&#x2022;</span>
              If you need directions or have questions, feel free to reach out at any time.
            </li>
          </ul>
        </div>

        {/* Venue & Map */}
        <div className="reunion-card p-6 sm:p-8 mb-8 overflow-hidden">
          <h2 className="reunion-heading text-xl mb-4">The Venue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="reunion-heading text-base mb-1">
                Kelsey&rsquo;s Original Roadhouse
              </h3>
              <p className="reunion-body text-sm opacity-60 mb-4">
                2nd Floor (Private Event Space)
              </p>
              <div className="space-y-3 reunion-body text-sm opacity-80">
                <div className="flex gap-3">
                  <span className="opacity-50 text-base leading-none mt-0.5">&#x1F4CD;</span>
                  <span>371 First Street<br />Collingwood, ON L9Y 1B4</span>
                </div>
                <div className="flex gap-3">
                  <span className="opacity-50 text-base leading-none mt-0.5">&#x1F697;</span>
                  <span>Free parking available onsite</span>
                </div>
              </div>
              <a
                href="https://maps.apple.com/place?address=371+First+St%2C+Collingwood+ON+L9Y+1B4%2C+Canada&coordinate=44.502019%2C-80.228263&name=Kelseys+Original+Roadhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="reunion-button-outline inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs mt-5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Get Directions
              </a>
            </div>
            <div className="reunion-map-wrap">
              <iframe
                title="Kelsey's Original Roadhouse - Collingwood"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-80.2320%2C44.4995%2C-80.2245%2C44.5045&layer=mapnik&marker=44.502019%2C-80.228263"
                className="reunion-map"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Closing message */}
        <div className="text-center mb-10">
          <p className="reunion-body text-sm opacity-70 leading-relaxed max-w-lg mx-auto mb-4">
            We hope to see everyone there for an afternoon filled with laughter,
            good food, and cherished moments. Don&rsquo;t miss out on this special
            occasion to celebrate our family ties!
          </p>
          <p className="reunion-body text-sm opacity-50 italic">
            With love,
          </p>
          <p className="reunion-body text-sm opacity-50">
            The Jorgensen &amp; Martin Family
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />
          <span className="reunion-flourish text-base">&#10045;</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />
        </div>

        {/* RSVP / Login card */}
        <div className="max-w-md mx-auto">
          <div className="reunion-card p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="reunion-heading text-xl mb-2">RSVP</h2>
              <p className="reunion-body text-sm opacity-70">
                Please RSVP by {eventDetails.rsvpDeadline}. Enter your
                personal access code below to get started.
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
          </div>

          {/* Contact info */}
          <p className="text-center reunion-body text-xs opacity-40 mt-6 mb-8">
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
    </div>
  );
}

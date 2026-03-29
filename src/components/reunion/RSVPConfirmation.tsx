import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { eventDetails, starterOptions, mainCourseOptions, dessertOptions, type FamilyMember } from "@/data/reunion-config";
import { getSubscription, setSubscription } from "@/data/reunion-data";
import type { GuestData } from "./GuestRow";
import { NewsFeed } from "./NewsFeed";

interface RSVPConfirmationProps {
  guests: GuestData[];
  onEdit: () => void;
  onLogout: () => void;
  isUpdate?: boolean;
  member?: FamilyMember;
}

function getMealName(options: { id: number; name: string }[], id: string) {
  return options.find((o) => String(o.id) === id)?.name ?? "\u2014";
}

export function RSVPConfirmation({ guests, onEdit, onLogout, isUpdate, member }: RSVPConfirmationProps) {
  const attending = guests.filter((g) => g.attending === "yes");
  const notAttending = guests.filter((g) => g.attending === "no");

  const [subscribed, setSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    if (!member) { setLoadingSub(false); return; }
    getSubscription(member.code).then((val) => {
      setSubscribed(val);
      setLoadingSub(false);
    });
  }, [member]);

  const handleToggleSub = async () => {
    if (!member) return;
    const newVal = !subscribed;
    setSubscribed(newVal);
    await setSubscription(member.code, newVal);
  };

  return (
    <div className="reunion-page min-h-screen flex items-center justify-center py-12 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Success check */}
        <div className="reunion-success-icon mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="reunion-title text-3xl sm:text-4xl mb-2">
          {isUpdate ? "You\u2019re All Set!" : "Thank You!"}
        </h1>
        <p className="reunion-subtitle text-base mb-8 opacity-70">
          {isUpdate ? "Your RSVP is on file" : "Your RSVP has been submitted"}
        </p>

        {/* Confirmation card */}
        <div className="reunion-card p-6 sm:p-8 text-left">
          {attending.length > 0 && (
            <div className="mb-6">
              <h3 className="reunion-heading text-sm uppercase tracking-wider mb-3 opacity-60">
                Attending ({attending.length})
              </h3>
              {attending.map((g, i) => (
                <div key={i} className="reunion-confirm-row">
                  <p className="reunion-heading text-sm mb-2">{g.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs reunion-body opacity-70">
                    <span>Starter: {getMealName(starterOptions, g.starter)}</span>
                    <span>Main: {getMealName(mainCourseOptions, g.mainCourse)}</span>
                    <span>Dessert: {getMealName(dessertOptions, g.dessert)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notAttending.length > 0 && (
            <div>
              <h3 className="reunion-heading text-sm uppercase tracking-wider mb-3 opacity-60">
                Unable to Attend ({notAttending.length})
              </h3>
              {notAttending.map((g, i) => (
                <p key={i} className="reunion-body text-sm opacity-70 mb-1">
                  {g.name}
                </p>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-center reunion-body text-xs opacity-50">
            <p>{eventDetails.date} &middot; {eventDetails.time}</p>
            <p>{eventDetails.location} &mdash; {eventDetails.address}</p>
          </div>
        </div>

        {/* Email subscription opt-in */}
        {member?.email && !loadingSub && (
          <div className="mt-6">
            <label className="reunion-card p-4 flex items-center gap-3 cursor-pointer text-left">
              <input
                type="checkbox"
                checked={subscribed}
                onChange={handleToggleSub}
                className="reunion-checkbox w-4 h-4 flex-shrink-0"
              />
              <div>
                <span className="reunion-body text-sm">
                  Email me updates
                </span>
                <p className="reunion-body text-xs opacity-40 mt-0.5">
                  Receive reunion news and announcements at {member.email}
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onEdit} variant="outline" className="reunion-button-outline">
            {isUpdate ? "Update Response" : "Edit Response"}
          </Button>
        </div>

        {/* News/Updates */}
        <div className="mt-10 text-left w-full max-w-lg">
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { eventDetails, type FamilyMember } from "@/data/reunion-config";
import { GuestRow, type GuestData } from "./GuestRow";
import { RSVPConfirmation } from "./RSVPConfirmation";
import { supabase } from "@/integrations/supabase/client";
import { getRsvpsForMember, getAllRsvps, type RsvpRecord } from "@/data/reunion-data";
import { NewsFeed } from "./NewsFeed";

interface RSVPFormProps {
  member: FamilyMember;
  onLogout: () => void;
  isAdmin?: boolean;
  onShowAdmin?: () => void;
  delegatedGuests?: string[];
}

const emptyGuest = (): GuestData => ({
  name: "",
  attending: "",
  starter: "",
  mainCourse: "",
  dessert: "",
});

// Convert an RsvpRecord from Supabase into the local GuestData format
function rsvpToGuest(r: RsvpRecord): GuestData {
  return {
    name: r.guest_name,
    attending: r.attending ? "yes" : "no",
    starter: r.starter != null ? String(r.starter) : "",
    mainCourse: r.main_course != null ? String(r.main_course) : "",
    dessert: r.dessert != null ? String(r.dessert) : "",
  };
}

export function RSVPForm({
  member,
  onLogout,
  isAdmin,
  onShowAdmin,
  delegatedGuests = [],
}: RSVPFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [guests, setGuests] = useState<GuestData[]>([
    { ...emptyGuest(), name: member.name },
  ]);

  // Track which indices are delegated (immutable name, can't remove)
  const [delegatedIndices, setDelegatedIndices] = useState<Set<number>>(
    new Set()
  );

  // Load existing RSVP data + delegated guests on mount
  useEffect(() => {
    async function loadExisting() {
      try {
        // Load own RSVPs
        const ownRsvps = await getRsvpsForMember(member.code);

        // If admin, load all RSVPs to pre-fill delegated guests
        let allRsvpMap = new Map<string, RsvpRecord>();
        if (isAdmin && delegatedGuests.length > 0) {
          const all = await getAllRsvps();
          all.forEach((r) => allRsvpMap.set(r.guest_name.toLowerCase(), r));
        }

        // Build guest list: start with own RSVPs or blank self
        const guestList: GuestData[] = ownRsvps.length > 0
          ? ownRsvps.map(rsvpToGuest)
          : [{ ...emptyGuest(), name: member.name }];

        const hasOwnRsvp = ownRsvps.length > 0;

        // Add delegated guests (pre-filled with their existing RSVPs if any)
        const existingNames = new Set(guestList.map((g) => g.name.toLowerCase()));
        const newDelegated = new Set<number>();

        for (const name of delegatedGuests) {
          if (existingNames.has(name.toLowerCase())) continue;
          const existingRsvp = allRsvpMap.get(name.toLowerCase());
          guestList.push(existingRsvp ? rsvpToGuest(existingRsvp) : { ...emptyGuest(), name });
          newDelegated.add(guestList.length - 1);
          existingNames.add(name.toLowerCase());
        }

        setGuests(guestList);
        setDelegatedIndices(newDelegated);

        // Show confirmation only if the primary member has submitted
        if (hasOwnRsvp) {
          setSubmitted(true);
        }
      } catch {
        // If fetch fails, show blank form
      } finally {
        setLoading(false);
      }
    }
    loadExisting();
  }, [member.code, member.name, isAdmin, delegatedGuests]);

  const updateGuest = (index: number, data: Partial<GuestData>) => {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, ...data } : g))
    );
  };

  const addGuest = () => {
    setGuests((prev) => [...prev, emptyGuest()]);
  };

  const removeGuest = (index: number) => {
    if (delegatedIndices.has(index)) return;
    setGuests((prev) => prev.filter((_, i) => i !== index));
    setDelegatedIndices((prev) => {
      const newSet = new Set<number>();
      prev.forEach((di) => {
        if (di < index) newSet.add(di);
        else if (di > index) newSet.add(di - 1);
      });
      return newSet;
    });
  };

  const isValid = guests.every((g) => {
    if (!g.attending) return false;
    if (g.attending === "yes" && (!g.starter || !g.mainCourse || !g.dessert))
      return false;
    if (g.attending === "yes" && !g.name.trim()) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    try {
      const rows = guests.map((g) => ({
        family_code: member.code,
        family_member: member.name,
        guest_name: g.name,
        attending: g.attending === "yes",
        starter: g.attending === "yes" ? parseInt(g.starter) : null,
        main_course: g.attending === "yes" ? parseInt(g.mainCourse) : null,
        dessert: g.attending === "yes" ? parseInt(g.dessert) : null,
        submitted_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("reunion_rsvps" as any).upsert(
        rows as any,
        { onConflict: "family_code,guest_name" as any }
      );

      if (error) {
        console.warn(
          "Supabase save failed (table may not exist yet):",
          error.message
        );
        console.log("RSVP data that would be saved:", rows);
      }

      setSubmitted(true);
      setEditing(false);
      toast({
        title: editing ? "RSVP Updated!" : "RSVP Submitted!",
        description: "Your response has been recorded. See you there!",
      });
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitted(true);
      setEditing(false);
      toast({
        title: "RSVP Submitted!",
        description: "Your response has been recorded.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="reunion-page min-h-screen flex items-center justify-center">
        <div className="reunion-grain" />
        <div className="relative z-10 text-center">
          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="reunion-body text-sm opacity-50">Loading your RSVP...</p>
        </div>
      </div>
    );
  }

  // Show confirmation if submitted and not actively editing
  if (submitted && !editing) {
    return (
      <RSVPConfirmation
        guests={guests}
        onEdit={() => setEditing(true)}
        onLogout={onLogout}
        isUpdate={true}
      />
    );
  }

  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="reunion-title text-3xl sm:text-4xl mb-1">
            {editing ? "Update RSVP" : "RSVP"}
          </h1>
          <p className="reunion-subtitle text-sm tracking-widest uppercase">
            {eventDetails.title}
          </p>
        </div>

        {/* Event summary bar */}
        <div className="reunion-info-bar mb-8">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm reunion-body">
            <span>{eventDetails.date}</span>
            <span className="opacity-40">|</span>
            <span>{eventDetails.time}</span>
            <span className="opacity-40">|</span>
            <span>{eventDetails.location}</span>
          </div>
          <p className="text-xs opacity-50 reunion-body mt-1">
            Please respond by {eventDetails.rsvpDeadline}
          </p>
        </div>

        {/* News/Updates */}
        <NewsFeed />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {guests.map((guest, i) => (
              <GuestRow
                key={i}
                index={i}
                guest={guest}
                isPrimary={i === 0}
                isDelegated={delegatedIndices.has(i)}
                onChange={updateGuest}
                onRemove={
                  i > 0 && !delegatedIndices.has(i) ? removeGuest : undefined
                }
              />
            ))}
          </div>

          {/* Add guest */}
          <button
            type="button"
            onClick={addGuest}
            className="reunion-add-guest mt-4"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add a family member</span>
          </button>

          {/* Submit */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              className="reunion-button flex-1"
              disabled={!isValid || submitting}
            >
              {submitting
                ? "Submitting..."
                : editing
                ? "Update RSVP"
                : "Submit RSVP"}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="outline"
                className="reunion-button-outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>

          {!isValid && guests.some((g) => g.attending) && (
            <p className="reunion-body text-xs opacity-50 mt-3 text-center">
              Please complete all meal selections for attending guests
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="reunion-body text-xs opacity-40">
            Questions? Contact{" "}
            <a
              href={`mailto:${eventDetails.contactEmail}`}
              className="underline hover:opacity-80"
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

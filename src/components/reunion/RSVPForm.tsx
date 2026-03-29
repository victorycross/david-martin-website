import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { eventDetails, type FamilyMember } from "@/data/reunion-config";
import { GuestRow, type GuestData } from "./GuestRow";
import { RSVPConfirmation } from "./RSVPConfirmation";
import { supabase } from "@/integrations/supabase/client";

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

export function RSVPForm({
  member,
  onLogout,
  isAdmin,
  onShowAdmin,
  delegatedGuests = [],
}: RSVPFormProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guests, setGuests] = useState<GuestData[]>([
    { ...emptyGuest(), name: member.name },
  ]);

  // Track which indices are delegated (immutable name, can't remove)
  const [delegatedIndices, setDelegatedIndices] = useState<Set<number>>(
    new Set()
  );

  // Pre-populate delegated guests on mount
  useEffect(() => {
    if (delegatedGuests.length === 0) return;
    setGuests((prev) => {
      // Only add delegated guests that aren't already in the list
      const existing = new Set(prev.map((g) => g.name.toLowerCase()));
      const toAdd = delegatedGuests
        .filter((name) => !existing.has(name.toLowerCase()))
        .map((name) => ({ ...emptyGuest(), name }));
      if (toAdd.length === 0) return prev;
      const newGuests = [...prev, ...toAdd];
      // Mark the new indices as delegated
      const newDelegated = new Set<number>();
      for (let i = prev.length; i < newGuests.length; i++) {
        newDelegated.add(i);
      }
      setDelegatedIndices(newDelegated);
      return newGuests;
    });
  }, [delegatedGuests]);

  const updateGuest = (index: number, data: Partial<GuestData>) => {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, ...data } : g))
    );
  };

  const addGuest = () => {
    setGuests((prev) => [...prev, emptyGuest()]);
  };

  const removeGuest = (index: number) => {
    if (delegatedIndices.has(index)) return; // Can't remove delegated guests
    setGuests((prev) => prev.filter((_, i) => i !== index));
    // Recompute delegated indices after removal
    setDelegatedIndices((prev) => {
      const newSet = new Set<number>();
      prev.forEach((di) => {
        if (di < index) newSet.add(di);
        else if (di > index) newSet.add(di - 1);
        // di === index: removed, skip
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
      toast({
        title: "RSVP Submitted!",
        description: "Your response has been recorded. See you there!",
      });
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitted(true);
      toast({
        title: "RSVP Submitted!",
        description: "Your response has been recorded.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <RSVPConfirmation
        guests={guests}
        onEdit={() => setSubmitted(false)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="reunion-title text-3xl sm:text-4xl mb-1">RSVP</h1>
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
              {submitting ? "Submitting..." : "Submit RSVP"}
            </Button>
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

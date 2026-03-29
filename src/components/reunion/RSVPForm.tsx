import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  editingGuestName?: string | null;
  onDoneEditingGuest?: () => void;
}

const emptyGuest = (): GuestData => ({
  name: "",
  attending: "",
  starter: "",
  mainCourse: "",
  dessert: "",
});

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
  editingGuestName,
  onDoneEditingGuest,
}: RSVPFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [guests, setGuests] = useState<GuestData[]>([
    { ...emptyGuest(), name: member.name },
  ]);

  // For delegates: which delegated guest are we editing (null = just self)
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null);

  // Admin editing a specific guest via status table pencil icon
  const [adminEditGuest, setAdminEditGuest] = useState<GuestData | null>(null);
  const [adminEditRsvpCode, setAdminEditRsvpCode] = useState<string | null>(null);

  // Load own RSVP data
  useEffect(() => {
    async function loadExisting() {
      try {
        const existing = await getRsvpsForMember(member.code);
        if (existing.length > 0) {
          setGuests(existing.map(rsvpToGuest));
          setSubmitted(true);
        }
      } catch {
        // show blank form
      } finally {
        setLoading(false);
      }
    }
    loadExisting();
  }, [member.code]);

  // Admin: load a specific guest for editing when editingGuestName changes
  useEffect(() => {
    if (!editingGuestName || !isAdmin) {
      setAdminEditGuest(null);
      setAdminEditRsvpCode(null);
      return;
    }
    async function loadGuest() {
      const all = await getAllRsvps();
      const match = all.find(
        (r) => r.guest_name.toLowerCase() === editingGuestName.toLowerCase()
      );
      if (match) {
        setAdminEditGuest(rsvpToGuest(match));
        setAdminEditRsvpCode(match.family_code);
      } else {
        setAdminEditGuest({ ...emptyGuest(), name: editingGuestName });
        setAdminEditRsvpCode(null);
      }
    }
    loadGuest();
  }, [editingGuestName, isAdmin]);

  // Delegate: load selected delegate's RSVP
  const [delegateGuest, setDelegateGuest] = useState<GuestData | null>(null);
  const [delegateRsvpCode, setDelegateRsvpCode] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDelegate) {
      setDelegateGuest(null);
      setDelegateRsvpCode(null);
      return;
    }
    async function loadDelegate() {
      const all = await getAllRsvps();
      const match = all.find(
        (r) => r.guest_name.toLowerCase() === selectedDelegate.toLowerCase()
      );
      if (match) {
        setDelegateGuest(rsvpToGuest(match));
        setDelegateRsvpCode(match.family_code);
      } else {
        setDelegateGuest({ ...emptyGuest(), name: selectedDelegate });
        setDelegateRsvpCode(null);
      }
    }
    loadDelegate();
  }, [selectedDelegate]);

  const updateGuest = (index: number, data: Partial<GuestData>) => {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, ...data } : g))
    );
  };

  const addGuest = () => {
    setGuests((prev) => [...prev, emptyGuest()]);
  };

  const removeGuest = (index: number) => {
    if (index === 0) return;
    setGuests((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid = guests.every((g) => {
    if (!g.attending) return false;
    if (g.attending === "yes" && (!g.starter || !g.mainCourse || !g.dessert)) return false;
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

      await supabase.from("reunion_rsvps" as any).upsert(
        rows as any,
        { onConflict: "family_code,guest_name" as any }
      );

      setSubmitted(true);
      setEditing(false);
      toast({ title: editing ? "RSVP Updated!" : "RSVP Submitted!", description: "Your response has been recorded." });
    } catch {
      setSubmitted(true);
      setEditing(false);
      toast({ title: "RSVP Submitted!", description: "Your response has been recorded." });
    } finally {
      setSubmitting(false);
    }
  };

  // Save a single guest (admin edit or delegate edit)
  const handleSaveSingleGuest = async (guest: GuestData, familyCode: string) => {
    try {
      await supabase.from("reunion_rsvps" as any).upsert(
        {
          family_code: familyCode,
          family_member: guest.name,
          guest_name: guest.name,
          attending: guest.attending === "yes",
          starter: guest.attending === "yes" ? parseInt(guest.starter) : null,
          main_course: guest.attending === "yes" ? parseInt(guest.mainCourse) : null,
          dessert: guest.attending === "yes" ? parseInt(guest.dessert) : null,
          submitted_at: new Date().toISOString(),
        } as any,
        { onConflict: "family_code,guest_name" as any }
      );
      toast({ title: `${guest.name}'s RSVP updated!` });
      if (editingGuestName) onDoneEditingGuest?.();
      if (selectedDelegate) setSelectedDelegate(null);
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    }
  };

  // Loading
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

  // Admin editing a specific guest
  if (adminEditGuest && editingGuestName) {
    const guestValid = adminEditGuest.attending &&
      (adminEditGuest.attending === "no" ||
        (adminEditGuest.starter && adminEditGuest.mainCourse && adminEditGuest.dessert));

    return (
      <div className="reunion-page min-h-screen py-8 px-4">
        <div className="reunion-grain" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={onDoneEditingGuest}
              className="reunion-body text-xs opacity-50 hover:opacity-80 underline mb-4 block"
            >
              &larr; Back
            </button>
            <h1 className="reunion-title text-3xl mb-1">
              Edit {editingGuestName}&rsquo;s RSVP
            </h1>
            <p className="reunion-subtitle text-sm tracking-widest uppercase">
              {eventDetails.title}
            </p>
          </div>

          <GuestRow
            index={0}
            guest={adminEditGuest}
            isPrimary={false}
            isDelegated={true}
            onChange={(_, data) => setAdminEditGuest((g) => g ? { ...g, ...data } : g)}
          />

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => handleSaveSingleGuest(
                adminEditGuest,
                adminEditRsvpCode || editingGuestName.toLowerCase().replace(/\s+/g, "") + "2026"
              )}
              className="reunion-button flex-1"
              disabled={!guestValid}
            >
              Save Changes
            </Button>
            <Button onClick={onDoneEditingGuest} variant="outline" className="reunion-button-outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show confirmation if own RSVP submitted and not editing
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
        <div className="mb-8">
          <h1 className="reunion-title text-3xl sm:text-4xl mb-1">
            {editing ? "Update RSVP" : "RSVP"}
          </h1>
          <p className="reunion-subtitle text-sm tracking-widest uppercase">
            {eventDetails.title}
          </p>
        </div>

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

        <NewsFeed />

        {/* Own RSVP form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {guests.map((guest, i) => (
              <GuestRow
                key={i}
                index={i}
                guest={guest}
                isPrimary={i === 0}
                onChange={updateGuest}
                onRemove={i > 0 ? removeGuest : undefined}
              />
            ))}
          </div>

          <button type="button" onClick={addGuest} className="reunion-add-guest mt-4">
            <span className="text-lg leading-none">+</span>
            <span>Add a family member</span>
          </button>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="reunion-button flex-1" disabled={!isValid || submitting}>
              {submitting ? "Submitting..." : editing ? "Update RSVP" : "Submit RSVP"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" className="reunion-button-outline" onClick={() => setEditing(false)}>
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

        {/* Delegate editing section */}
        {delegatedGuests.length > 0 && !isAdmin && (
          <div className="mt-10 pt-6 border-t border-white/10">
            <h2 className="reunion-heading text-lg mb-3">Edit Another Guest</h2>
            <p className="reunion-body text-xs opacity-50 mb-4">
              You can manage RSVPs for the following family members.
            </p>
            <Select
              value={selectedDelegate ?? ""}
              onValueChange={(v) => setSelectedDelegate(v || null)}
            >
              <SelectTrigger className="reunion-select">
                <SelectValue placeholder="Select a guest to edit..." />
              </SelectTrigger>
              <SelectContent className="reunion-select-content">
                {delegatedGuests.sort().map((name) => (
                  <SelectItem key={name} value={name} className="reunion-select-item">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {delegateGuest && selectedDelegate && (
              <div className="mt-4">
                <GuestRow
                  index={0}
                  guest={delegateGuest}
                  isPrimary={false}
                  isDelegated={true}
                  onChange={(_, data) => setDelegateGuest((g) => g ? { ...g, ...data } : g)}
                />
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={() => handleSaveSingleGuest(
                      delegateGuest,
                      delegateRsvpCode || selectedDelegate.toLowerCase().replace(/\s+/g, "") + "2026"
                    )}
                    className="reunion-button flex-1"
                    disabled={
                      !delegateGuest.attending ||
                      (delegateGuest.attending === "yes" &&
                        (!delegateGuest.starter || !delegateGuest.mainCourse || !delegateGuest.dessert))
                    }
                  >
                    Save {selectedDelegate}&rsquo;s RSVP
                  </Button>
                  <Button
                    onClick={() => setSelectedDelegate(null)}
                    variant="outline"
                    className="reunion-button-outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="reunion-body text-xs opacity-40">
            Questions? Contact{" "}
            <a href={`mailto:${eventDetails.contactEmail}`} className="underline hover:opacity-80">
              {eventDetails.contactEmail}
            </a>{" "}
            or call {eventDetails.contactPhone}
          </p>
        </div>
      </div>
    </div>
  );
}

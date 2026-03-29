import { useState, useEffect } from "react";
import { ReunionLogin } from "@/components/reunion/ReunionLogin";
import { RSVPForm } from "@/components/reunion/RSVPForm";
import { AdminPanel } from "@/components/reunion/AdminPanel";
import { PhotoGallery } from "@/components/reunion/PhotoGallery";
import { isAdmin, type FamilyMember } from "@/data/reunion-config";
import { getDelegationsForManager } from "@/data/reunion-data";

const STORAGE_KEY = "reunion_member";

export default function FamilyReunion() {
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeView, setActiveView] = useState<"rsvp" | "photos">("rsvp");
  const [delegatedGuests, setDelegatedGuests] = useState<string[]>([]);
  // For admin quick-edit from status table
  const [editingGuestName, setEditingGuestName] = useState<string | null>(null);

  // Set page title
  useEffect(() => {
    const original = document.title;
    document.title = "2026 Family Reunion";
    return () => { document.title = original; };
  }, []);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMember(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Load delegated guests (non-admin only — admins edit via status table)
  useEffect(() => {
    if (!member || isAdmin(member)) return;
    getDelegationsForManager(member.code).then(setDelegatedGuests);
  }, [member]);

  const handleLogin = (m: FamilyMember) => {
    setMember(m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
  };

  const handleLogout = () => {
    setMember(null);
    setShowAdmin(false);
    setActiveView("rsvp");
    setDelegatedGuests([]);
    setEditingGuestName(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Admin edits a specific guest from the status table
  const handleEditGuest = (guestName: string) => {
    setEditingGuestName(guestName);
    setShowAdmin(false);
    setActiveView("rsvp");
  };

  if (!member) {
    return <ReunionLogin onLogin={handleLogin} />;
  }

  if (showAdmin && isAdmin(member)) {
    return (
      <AdminPanel
        onBack={() => setShowAdmin(false)}
        adminCode={member.code}
        adminName={member.name}
        onEditGuest={handleEditGuest}
      />
    );
  }

  return (
    <>
      {/* RSVP / Photos toggle bar */}
      <div className="reunion-page">
        <div className="reunion-grain" />
        <div className="relative z-10 max-w-2xl mx-auto pt-6 px-4 flex items-center justify-between">
          <div className="reunion-view-toggle">
            <button
              onClick={() => { setActiveView("rsvp"); setEditingGuestName(null); }}
              className={`reunion-view-btn ${activeView === "rsvp" ? "reunion-view-btn-active" : ""}`}
            >
              RSVP
            </button>
            <button
              onClick={() => setActiveView("photos")}
              className={`reunion-view-btn ${activeView === "photos" ? "reunion-view-btn-active" : ""}`}
            >
              Photos
            </button>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin(member) && (
              <button
                onClick={() => setShowAdmin(true)}
                className="reunion-button-outline px-3 py-1.5 rounded-lg text-xs"
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="reunion-body text-xs opacity-50 hover:opacity-80 transition-opacity underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {activeView === "rsvp" ? (
        <RSVPForm
          member={member}
          onLogout={handleLogout}
          isAdmin={isAdmin(member)}
          onShowAdmin={() => setShowAdmin(true)}
          delegatedGuests={delegatedGuests}
          editingGuestName={editingGuestName}
          onDoneEditingGuest={() => setEditingGuestName(null)}
        />
      ) : (
        <PhotoGallery member={member} />
      )}
    </>
  );
}

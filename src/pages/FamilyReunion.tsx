import { useState, useEffect } from "react";
import { ReunionThankYou } from "@/components/reunion/ReunionThankYou";
import { ReunionPortal } from "@/components/reunion/ReunionPortal";
import { AdminPanel } from "@/components/reunion/AdminPanel";
import { isAdmin, type FamilyMember } from "@/data/reunion-config";

const STORAGE_KEY = "reunion_member";

type View = "thankyou" | "portal" | "admin";

export default function FamilyReunion() {
  const [view, setView] = useState<View>("thankyou");
  const [member, setMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const original = document.title;
    document.title = "2026 Family Reunion";
    return () => { document.title = original; };
  }, []);

  // Restore session — stay on thank-you page, member used as shortcut
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMember(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const handleAuthenticate = (m: FamilyMember) => {
    setMember(m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
    setView("portal");
  };

  const handleSignOut = () => {
    setMember(null);
    setView("thankyou");
    localStorage.removeItem(STORAGE_KEY);
  };

  if (view === "portal" && member) {
    return (
      <ReunionPortal
        member={member}
        onBack={handleSignOut}
        onShowAdmin={() => setView("admin")}
      />
    );
  }

  if (view === "admin" && member && isAdmin(member)) {
    return (
      <AdminPanel
        onBack={() => setView("portal")}
        adminCode={member.code}
        adminName={member.name}
        onEditGuest={() => setView("portal")}
      />
    );
  }

  return <ReunionThankYou onAuthenticate={handleAuthenticate} currentMember={member} />;
}

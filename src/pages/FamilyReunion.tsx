import { useState, useEffect } from "react";
import { ReunionThankYou } from "@/components/reunion/ReunionThankYou";
import { ReunionPortal } from "@/components/reunion/ReunionPortal";
import { AdminPanel } from "@/components/reunion/AdminPanel";
import { isAdmin, type FamilyMember } from "@/data/reunion-config";

const STORAGE_KEY = "reunion_member";

type View = "landing" | "portal" | "admin";

export default function FamilyReunion() {
  const [view, setView] = useState<View>("landing");
  const [member, setMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    window.location.replace("https://jorgensen.social");
  }, []);

  useEffect(() => {
    const original = document.title;
    document.title = "2026 Family Reunion";
    return () => { document.title = original; };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMember(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const handleEnterPortal = (m: FamilyMember) => {
    setMember(m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
    setView("portal");
  };

  const handleSignOut = () => {
    setMember(null);
    setView("landing");
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

  return <ReunionThankYou onEnterPortal={handleEnterPortal} currentMember={member} />;
}

import { useState, useEffect } from "react";
import { ReunionLogin } from "@/components/reunion/ReunionLogin";
import { RSVPForm } from "@/components/reunion/RSVPForm";
import { AdminPanel } from "@/components/reunion/AdminPanel";
import { isAdmin, type FamilyMember } from "@/data/reunion-config";
import { getDelegationsForManager } from "@/data/reunion-data";

const STORAGE_KEY = "reunion_member";

export default function FamilyReunion() {
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [delegatedGuests, setDelegatedGuests] = useState<string[]>([]);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMember(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Load delegations for logged-in member
  useEffect(() => {
    if (!member) return;
    getDelegationsForManager(member.code).then(setDelegatedGuests);
  }, [member]);

  const handleLogin = (m: FamilyMember) => {
    setMember(m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
  };

  const handleLogout = () => {
    setMember(null);
    setShowAdmin(false);
    setDelegatedGuests([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!member) {
    return <ReunionLogin onLogin={handleLogin} />;
  }

  if (showAdmin && isAdmin(member)) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  return (
    <RSVPForm
      member={member}
      onLogout={handleLogout}
      isAdmin={isAdmin(member)}
      onShowAdmin={() => setShowAdmin(true)}
      delegatedGuests={delegatedGuests}
    />
  );
}

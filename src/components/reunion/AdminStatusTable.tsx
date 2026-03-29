import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { type FamilyMember } from "@/data/reunion-config";
import { supabase } from "@/integrations/supabase/client";
import {
  getInviteUrl,
  getInviteEmailBody,
  getAllInviteLinks,
  updateMember,
  type RsvpRecord,
} from "@/data/reunion-data";

interface AdminStatusTableProps {
  allMembers: FamilyMember[];
  rsvps: RsvpRecord[];
  onEditGuest?: (guestName: string) => void;
  onDataChange?: () => void;
}

type SortKey = "name" | "status" | "attending";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className={`inline ml-1 ${active ? "opacity-100" : "opacity-30"}`}>
      <path d="M5 2L8 6H2Z" fill={active && dir === "asc" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" />
      <path d="M5 8L2 4H8Z" fill={active && dir === "desc" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function AdminStatusTable({ allMembers, rsvps, onEditGuest, onDataChange }: AdminStatusTableProps) {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [collapsed, setCollapsed] = useState(false);

  // Profile edit dialog
  const [editingProfile, setEditingProfile] = useState<FamilyMember | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const openProfileEdit = (m: FamilyMember) => {
    setEditingProfile(m);
    setEditName(m.name);
    setEditEmail(m.email || "");
  };

  const handleSaveProfile = async () => {
    if (!editingProfile || !editName.trim()) return;
    setSavingProfile(true);
    try {
      await updateMember(editingProfile.code, {
        name: editName.trim(),
        email: editEmail.trim() || undefined,
      });
      toast({ title: "Profile updated", description: `${editName.trim()} has been saved.` });
      setEditingProfile(null);
      onDataChange?.();
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const memberStatus = useMemo(() => {
    const list = allMembers.map((m) => {
      const memberRsvps = rsvps.filter(
        (r) => r.family_code.toLowerCase() === m.code.toLowerCase()
      );
      const hasResponded = memberRsvps.length > 0;
      const attending = memberRsvps.filter((r) => r.attending).length;
      const declined = memberRsvps.filter((r) => !r.attending).length;
      return { member: m, hasResponded, attending, declined, total: memberRsvps.length };
    });

    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.member.name.localeCompare(b.member.name);
      else if (sortKey === "status") cmp = (a.hasResponded ? 1 : 0) - (b.hasResponded ? 1 : 0);
      else if (sortKey === "attending") cmp = a.attending - b.attending;
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [allMembers, rsvps, sortKey, sortDir]);

  const responded = memberStatus.filter((s) => s.hasResponded).length;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const copyLink = async (member: FamilyMember) => {
    const url = getInviteUrl(member);
    await navigator.clipboard.writeText(url);
    setCopiedCode(member.code);
    toast({ title: "Link copied!", description: `Invite link for ${member.name} copied to clipboard.` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyAllLinks = async () => {
    const text = getAllInviteLinks(allMembers);
    await navigator.clipboard.writeText(text);
    toast({ title: "All links copied!", description: `${allMembers.length} invite links copied to clipboard.` });
  };

  const emailInvite = async (member: FamilyMember) => {
    if (!member.email) {
      const subject = `You're Invited! 2026 Family Reunion RSVP`;
      const body = getInviteEmailBody(member);
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      toast({ title: "Invite text copied", description: `No email on file for ${member.name}. Add one via Manage tab.` });
      return;
    }
    setSending(member.code);
    try {
      const { error } = await supabase.functions.invoke("send-invite", {
        body: { to: member.email, name: member.name, code: member.code, inviteUrl: getInviteUrl(member) },
      });
      if (error) throw error;
      toast({ title: "Invite sent!", description: `Email sent to ${member.name} at ${member.email}` });
    } catch (err: any) {
      toast({ title: "Failed to send", description: err?.message ?? "Could not send email.", variant: "destructive" });
    } finally {
      setSending(null);
    }
  };

  return (
    <div>
      {/* Summary bar */}
      <div className="reunion-info-bar mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button onClick={() => setCollapsed((c) => !c)} className="reunion-heading text-lg text-left flex items-center gap-2">
          <span className={`reunion-collapse-arrow ${collapsed ? "" : "reunion-collapse-arrow-open"}`}>&#x25B6;</span>
          {responded} of {allMembers.length}{" "}
          <span className="reunion-body text-sm opacity-60">families responded</span>
        </button>
        <div className="flex gap-2">
          <Button onClick={copyAllLinks} variant="outline" className="reunion-button-outline text-xs px-3 py-1.5">
            Copy All Links
          </Button>
        </div>
      </div>

      {!collapsed && (
        <div className="overflow-x-auto">
          <table className="reunion-admin-table w-full">
            <thead>
              <tr>
                <th className="text-left cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Family Member <SortIcon active={sortKey === "name"} dir={sortDir} />
                </th>
                <th className="text-center cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  Status <SortIcon active={sortKey === "status"} dir={sortDir} />
                </th>
                <th className="text-center cursor-pointer select-none" onClick={() => toggleSort("attending")}>
                  Attending <SortIcon active={sortKey === "attending"} dir={sortDir} />
                </th>
                <th className="text-right">Invite</th>
              </tr>
            </thead>
            <tbody>
              {memberStatus.map((s) => (
                <tr key={s.member.code}>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className="reunion-heading text-sm">{s.member.name}</span>
                      <button
                        onClick={() => openProfileEdit(s.member)}
                        className="reunion-invite-btn opacity-0 group-hover:opacity-100"
                        style={{ opacity: undefined }}
                        title={`Edit ${s.member.name}'s profile`}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "")}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </button>
                    </div>
                    {s.member.email && (
                      <span className="reunion-body text-xs opacity-40">{s.member.email}</span>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                    {s.hasResponded ? (
                      <span className="reunion-status-submitted">Submitted</span>
                    ) : (
                      <span className="reunion-status-pending">Pending</span>
                    )}
                    {onEditGuest && (
                      <button
                        onClick={() => onEditGuest(s.member.name)}
                        className="reunion-invite-btn"
                        title={`Edit ${s.member.name}'s RSVP`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                    )}
                  </div>
                  </td>
                  <td className="text-center reunion-body text-sm">
                    {s.hasResponded ? `${s.attending} yes${s.declined ? `, ${s.declined} no` : ""}` : "\u2014"}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => copyLink(s.member)} className="reunion-invite-btn" title={`Copy invite link for ${s.member.name}`}>
                        {copiedCode === s.member.code ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                        )}
                      </button>
                      <button onClick={() => emailInvite(s.member)} className="reunion-invite-btn" title={s.member.email ? `Send invite to ${s.member.email}` : `No email — copies invite text`} disabled={sending === s.member.code}>
                        {sending === s.member.code ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profile edit dialog */}
      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent className="reunion-dialog">
          <DialogHeader>
            <DialogTitle className="reunion-heading text-lg">
              Edit Profile — {editingProfile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="reunion-label mb-1.5 block">Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="reunion-input"
              />
            </div>
            <div>
              <Label className="reunion-label mb-1.5 block">
                Email <span className="opacity-50">(optional)</span>
              </Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="name@example.com"
                className="reunion-input"
              />
            </div>
            <div className="reunion-body text-xs opacity-40">
              Code: <code className="font-mono">{editingProfile?.code}</code>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveProfile}
                className="reunion-button flex-1"
                disabled={!editName.trim() || savingProfile}
              >
                {savingProfile ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={() => setEditingProfile(null)}
                variant="outline"
                className="reunion-button-outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type FamilyMember } from "@/data/reunion-config";
import { supabase } from "@/integrations/supabase/client";
import {
  getInviteUrl,
  getInviteEmailBody,
  getAllInviteLinks,
  type RsvpRecord,
} from "@/data/reunion-data";

interface AdminStatusTableProps {
  allMembers: FamilyMember[];
  rsvps: RsvpRecord[];
}

export function AdminStatusTable({ allMembers, rsvps }: AdminStatusTableProps) {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const memberStatus = allMembers.map((m) => {
    const memberRsvps = rsvps.filter(
      (r) => r.family_code.toLowerCase() === m.code.toLowerCase()
    );
    const hasResponded = memberRsvps.length > 0;
    const attending = memberRsvps.filter((r) => r.attending).length;
    const declined = memberRsvps.filter((r) => !r.attending).length;
    const lastSubmit = memberRsvps[0]?.submitted_at;

    return { member: m, hasResponded, attending, declined, total: memberRsvps.length, lastSubmit };
  });

  const responded = memberStatus.filter((s) => s.hasResponded).length;

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

  const [sending, setSending] = useState<string | null>(null);

  const emailInvite = async (member: FamilyMember) => {
    if (!member.email) {
      // No email — copy the invite text to clipboard
      const subject = `You're Invited! 2026 Family Reunion RSVP`;
      const body = getInviteEmailBody(member);
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      toast({
        title: "Invite text copied",
        description: `No email on file for ${member.name}. Add one via Manage tab, or paste this into your email client.`,
      });
      return;
    }

    setSending(member.code);
    try {
      const { data, error } = await supabase.functions.invoke("send-invite", {
        body: {
          to: member.email,
          name: member.name,
          code: member.code,
          inviteUrl: getInviteUrl(member),
        },
      });

      if (error) throw error;

      toast({
        title: "Invite sent!",
        description: `Email sent to ${member.name} at ${member.email}`,
      });
    } catch (err: any) {
      console.error("Send invite error:", err);
      toast({
        title: "Failed to send",
        description: err?.message ?? "Could not send email. Try again.",
        variant: "destructive",
      });
    } finally {
      setSending(null);
    }
  };

  return (
    <div>
      {/* Summary bar with bulk actions */}
      <div className="reunion-info-bar mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="reunion-heading text-lg">
          {responded} of {allMembers.length}{" "}
          <span className="reunion-body text-sm opacity-60">families responded</span>
        </p>
        <div className="flex gap-2">
          <Button
            onClick={copyAllLinks}
            variant="outline"
            className="reunion-button-outline text-xs px-3 py-1.5"
          >
            Copy All Links
          </Button>
        </div>
      </div>

      {/* Status table */}
      <div className="overflow-x-auto">
        <table className="reunion-admin-table w-full">
          <thead>
            <tr>
              <th className="text-left">Family Member</th>
              <th className="text-center">Status</th>
              <th className="text-center">Attending</th>
              <th className="text-right">Invite</th>
            </tr>
          </thead>
          <tbody>
            {memberStatus.map((s) => (
              <tr key={s.member.code}>
                <td>
                  <span className="reunion-heading text-sm">{s.member.name}</span>
                  {s.member.email && (
                    <span className="reunion-body text-xs opacity-40 ml-2">
                      {s.member.email}
                    </span>
                  )}
                </td>
                <td className="text-center">
                  {s.hasResponded ? (
                    <span className="reunion-status-submitted">Submitted</span>
                  ) : (
                    <span className="reunion-status-pending">Pending</span>
                  )}
                </td>
                <td className="text-center reunion-body text-sm">
                  {s.hasResponded
                    ? `${s.attending} yes${s.declined ? `, ${s.declined} no` : ""}`
                    : "\u2014"}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => copyLink(s.member)}
                      className="reunion-invite-btn"
                      title={`Copy invite link for ${s.member.name}`}
                    >
                      {copiedCode === s.member.code ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => emailInvite(s.member)}
                      className="reunion-invite-btn"
                      title={s.member.email ? `Send invite to ${s.member.email}` : `No email — copies invite text`}
                      disabled={sending === s.member.code}
                    >
                      {sending === s.member.code ? (
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

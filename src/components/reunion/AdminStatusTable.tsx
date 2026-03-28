import { familyMembers, type FamilyMember } from "@/data/reunion-config";
import type { RsvpRecord } from "@/data/reunion-data";

interface AdminStatusTableProps {
  allMembers: FamilyMember[];
  rsvps: RsvpRecord[];
}

export function AdminStatusTable({ allMembers, rsvps }: AdminStatusTableProps) {
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

  return (
    <div>
      <div className="reunion-info-bar mb-6">
        <p className="reunion-heading text-lg">
          {responded} of {allMembers.length}{" "}
          <span className="reunion-body text-sm opacity-60">families responded</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="reunion-admin-table w-full">
          <thead>
            <tr>
              <th className="text-left">Family Member</th>
              <th className="text-center">Status</th>
              <th className="text-center">Attending</th>
              <th className="text-center">Declined</th>
              <th className="text-right">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {memberStatus.map((s) => (
              <tr key={s.member.code}>
                <td className="reunion-heading text-sm">{s.member.name}</td>
                <td className="text-center">
                  {s.hasResponded ? (
                    <span className="reunion-status-submitted">Submitted</span>
                  ) : (
                    <span className="reunion-status-pending">Pending</span>
                  )}
                </td>
                <td className="text-center reunion-body text-sm">
                  {s.hasResponded ? s.attending : "\u2014"}
                </td>
                <td className="text-center reunion-body text-sm">
                  {s.hasResponded ? s.declined : "\u2014"}
                </td>
                <td className="text-right reunion-body text-xs opacity-50">
                  {s.lastSubmit
                    ? new Date(s.lastSubmit).toLocaleDateString()
                    : "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

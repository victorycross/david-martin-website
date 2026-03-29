import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ADMIN_CODES, type FamilyMember } from "@/data/reunion-config";
import {
  setDelegation,
  removeDelegation,
  type DelegationAssignment,
} from "@/data/reunion-data";

interface AdminDelegationProps {
  allMembers: FamilyMember[];
  delegations: DelegationAssignment[];
  onUpdate: () => void;
}

export function AdminDelegation({
  allMembers,
  delegations,
  onUpdate,
}: AdminDelegationProps) {
  const [saving, setSaving] = useState<string | null>(null);

  // Members who can be managers (everyone)
  const managers = allMembers;

  // Members who can be delegated (everyone except David)
  const delegateable = allMembers.filter(
    (m) => !ADMIN_CODES.includes(m.code.toLowerCase())
  );

  const getManagerFor = (memberName: string): string => {
    const d = delegations.find((d) => d.delegateName === memberName);
    return d?.managerCode ?? "self";
  };

  const handleChange = async (delegateName: string, value: string) => {
    setSaving(delegateName);
    try {
      if (value === "self") {
        await removeDelegation(delegateName);
      } else {
        await setDelegation(delegateName, value);
      }
      onUpdate();
    } finally {
      setSaving(null);
    }
  };

  // Group by manager for the summary view
  const managerGroups = managers
    .map((m) => ({
      manager: m,
      delegates: delegations
        .filter((d) => d.managerCode.toLowerCase() === m.code.toLowerCase())
        .map((d) => d.delegateName),
    }))
    .filter((g) => g.delegates.length > 0);

  return (
    <div>
      {/* Summary */}
      {managerGroups.length > 0 && (
        <div className="reunion-info-bar mb-6">
          <p className="reunion-label mb-2">Current Assignments</p>
          {managerGroups.map((g) => (
            <p key={g.manager.code} className="reunion-body text-sm mb-1">
              <span className="reunion-heading text-sm">{g.manager.name}</span>{" "}
              manages:{" "}
              <span className="opacity-70">{g.delegates.join(", ")}</span>
            </p>
          ))}
        </div>
      )}

      {/* Assignment controls */}
      <div className="space-y-3">
        {delegateable.map((member) => (
          <div
            key={member.code}
            className="reunion-guest-row flex items-center justify-between gap-4"
          >
            <span className="reunion-heading text-sm flex-shrink-0 min-w-[100px]">
              {member.name}
            </span>

            <div className="flex items-center gap-2 flex-1 max-w-[250px]">
              <Label className="reunion-label text-xs whitespace-nowrap">
                Managed by:
              </Label>
              <Select
                value={getManagerFor(member.name)}
                onValueChange={(v) => handleChange(member.name, v)}
                disabled={saving === member.name}
              >
                <SelectTrigger className="reunion-select text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="reunion-select-content">
                  <SelectItem value="self" className="reunion-select-item">
                    Self
                  </SelectItem>
                  {managers
                    .filter((m) => m.name !== member.name)
                    .map((m) => (
                      <SelectItem
                        key={m.code}
                        value={m.code}
                        className="reunion-select-item"
                      >
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

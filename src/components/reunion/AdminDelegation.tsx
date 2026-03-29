import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ADMIN_CODES, type FamilyMember } from "@/data/reunion-config";
import {
  setDelegationsForPerson,
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
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);

  // All members can be delegated (including admins — they might want someone
  // else to also RSVP for their kids, etc.)
  const delegateable = allMembers;

  // All members can be managers
  const managers = allMembers;

  // Get current manager codes for a given delegate
  const getManagersFor = (memberName: string): string[] => {
    return delegations
      .filter((d) => d.delegateName === memberName)
      .map((d) => d.managerCode);
  };

  const toggleManager = async (
    delegateName: string,
    managerCode: string,
    currentManagers: string[]
  ) => {
    setSaving(delegateName);
    try {
      const newManagers = currentManagers.includes(managerCode)
        ? currentManagers.filter((c) => c !== managerCode)
        : [...currentManagers, managerCode];
      await setDelegationsForPerson(delegateName, newManagers);
      onUpdate();
      const managerName = managers.find(
        (m) => m.code === managerCode
      )?.name;
      if (newManagers.includes(managerCode)) {
        toast({
          title: `${managerName} can now manage ${delegateName}`,
        });
      }
    } finally {
      setSaving(null);
    }
  };

  // Group by manager for summary
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
          <p className="reunion-label mb-3">Current Assignments</p>
          {managerGroups.map((g) => (
            <div key={g.manager.code} className="reunion-body text-sm mb-2 flex items-start gap-2">
              <span className="reunion-heading text-sm whitespace-nowrap">
                {g.manager.name}
              </span>
              <span className="opacity-40">&rarr;</span>
              <span className="opacity-70">{g.delegates.join(", ")}</span>
            </div>
          ))}
        </div>
      )}

      {/* Assignment grid */}
      <div className="space-y-3">
        {delegateable.map((member) => {
          const currentManagers = getManagersFor(member.name);
          const isSaving = saving === member.name;

          return (
            <div key={member.code} className="reunion-guest-row">
              <div className="flex items-center justify-between mb-3">
                <span className="reunion-heading text-sm">
                  {member.name}
                </span>
                {currentManagers.length === 0 ? (
                  <span className="reunion-body text-xs opacity-40">
                    Self only
                  </span>
                ) : (
                  <span className="reunion-body text-xs opacity-50">
                    {currentManagers.length} manager{currentManagers.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {managers
                  .filter((m) => m.name !== member.name)
                  .map((mgr) => {
                    const isActive = currentManagers.includes(mgr.code);
                    return (
                      <button
                        key={mgr.code}
                        onClick={() =>
                          toggleManager(member.name, mgr.code, currentManagers)
                        }
                        disabled={isSaving}
                        className={`reunion-delegate-chip ${
                          isActive ? "reunion-delegate-chip-active" : ""
                        }`}
                      >
                        {mgr.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

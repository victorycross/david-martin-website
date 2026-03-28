import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMember, type RsvpRecord } from "@/data/reunion-data";
import { familyMembers, type FamilyMember } from "@/data/reunion-config";

interface AdminAddMemberProps {
  allMembers: FamilyMember[];
  onUpdate: () => void;
}

export function AdminAddMember({ allMembers, onUpdate }: AdminAddMemberProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [lastAdded, setLastAdded] = useState<FamilyMember | null>(null);
  const [adding, setAdding] = useState(false);

  // Dynamic members = those not in the static config
  const staticCodes = new Set(familyMembers.map((m) => m.code.toLowerCase()));
  const dynamicMembers = allMembers.filter(
    (m) => !staticCodes.has(m.code.toLowerCase())
  );

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const code = trimmed.toLowerCase().replace(/\s+/g, "") + "2026";
    const exists = allMembers.some(
      (m) => m.code.toLowerCase() === code.toLowerCase()
    );
    if (exists) {
      setError(`"${trimmed}" already exists`);
      return;
    }

    setAdding(true);
    setError("");
    try {
      const member = await addMember(trimmed);
      setLastAdded(member);
      setName("");
      onUpdate();
    } catch {
      setError("Failed to add member");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      {/* Add form */}
      <div className="reunion-card p-6 mb-6">
        <h3 className="reunion-heading text-base mb-4">Add Family Member</h3>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label className="reunion-label mb-1.5 block">Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
                setLastAdded(null);
              }}
              placeholder="e.g. Sarah"
              className="reunion-input"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button
            onClick={handleAdd}
            className="reunion-button"
            disabled={!name.trim() || adding}
          >
            {adding ? "Adding..." : "Add"}
          </Button>
        </div>

        {error && (
          <p className="reunion-body text-sm text-red-400 mt-2">{error}</p>
        )}

        {lastAdded && (
          <div className="mt-4 p-4 rounded-lg bg-green-900/20 border border-green-800/30">
            <p className="reunion-heading text-sm mb-1">
              {lastAdded.name} added!
            </p>
            <p className="reunion-body text-sm">
              Access code:{" "}
              <code className="bg-white/10 px-2 py-0.5 rounded text-amber-300 font-mono text-xs">
                {lastAdded.code}
              </code>
            </p>
            <p className="reunion-body text-xs opacity-50 mt-1">
              Share this code with {lastAdded.name} so they can RSVP
            </p>
          </div>
        )}
      </div>

      {/* Dynamic members list */}
      {dynamicMembers.length > 0 && (
        <div>
          <h3 className="reunion-label mb-3">Added Members</h3>
          <div className="space-y-2">
            {dynamicMembers.map((m) => (
              <div key={m.code} className="reunion-guest-row flex items-center justify-between">
                <span className="reunion-heading text-sm">{m.name}</span>
                <code className="reunion-body text-xs opacity-50 font-mono">
                  {m.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

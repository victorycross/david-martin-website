import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { addMember, updateMember } from "@/data/reunion-data";
import { familyMembers, type FamilyMember } from "@/data/reunion-config";

interface AdminAddMemberProps {
  allMembers: FamilyMember[];
  onUpdate: () => void;
}

export function AdminAddMember({ allMembers, onUpdate }: AdminAddMemberProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [lastAdded, setLastAdded] = useState<FamilyMember | null>(null);
  const [adding, setAdding] = useState(false);

  // Edit dialog state
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const openEdit = (member: FamilyMember) => {
    setEditing(member);
    setEditName(member.name);
    setEditCode(member.code);
    setEditEmail(member.email || "");
    setEditError("");
  };

  const handleSave = async () => {
    if (!editing) return;
    const trimmedName = editName.trim();
    const trimmedCode = editCode.trim().toLowerCase();
    const trimmedEmail = editEmail.trim();

    if (!trimmedName) {
      setEditError("Name is required");
      return;
    }
    if (!trimmedCode) {
      setEditError("Code is required");
      return;
    }

    // Check for code conflicts (excluding the member being edited)
    const conflict = allMembers.find(
      (m) =>
        m.code.toLowerCase() === trimmedCode &&
        m.code.toLowerCase() !== editing.code.toLowerCase()
    );
    if (conflict) {
      setEditError(`Code "${trimmedCode}" is already used by ${conflict.name}`);
      return;
    }

    setSaving(true);
    try {
      await updateMember(editing.code, {
        name: trimmedName,
        code: trimmedCode,
        email: trimmedEmail || undefined,
      });
      toast({
        title: "Member updated",
        description: `${trimmedName} has been updated.`,
      });
      setEditing(null);
      onUpdate();
    } catch {
      setEditError("Failed to save changes");
    } finally {
      setSaving(false);
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

      {/* All members list */}
      <h3 className="reunion-label mb-3">All Members</h3>
      <div className="space-y-2">
        {allMembers.map((m) => (
          <div
            key={m.code}
            className="reunion-guest-row flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <span className="reunion-heading text-sm">{m.name}</span>
              <div className="flex items-center gap-3 mt-0.5">
                <code className="reunion-body text-xs opacity-40 font-mono">
                  {m.code}
                </code>
                {m.email && (
                  <span className="reunion-body text-xs opacity-40">
                    {m.email}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => openEdit(m)}
              className="reunion-invite-btn"
              title={`Edit ${m.name}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="reunion-dialog">
          <DialogHeader>
            <DialogTitle className="reunion-heading text-lg">
              Edit {editing?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="reunion-label mb-1.5 block">Name</Label>
              <Input
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setEditError("");
                }}
                className="reunion-input"
              />
            </div>

            <div>
              <Label className="reunion-label mb-1.5 block">Access Code</Label>
              <Input
                value={editCode}
                onChange={(e) => {
                  setEditCode(e.target.value.toLowerCase().replace(/\s+/g, ""));
                  setEditError("");
                }}
                className="reunion-input font-mono text-sm"
              />
              <p className="reunion-body text-xs opacity-40 mt-1">
                This is what the member types to log in
              </p>
            </div>

            <div>
              <Label className="reunion-label mb-1.5 block">
                Email <span className="opacity-50">(optional)</span>
              </Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value);
                  setEditError("");
                }}
                placeholder="name@example.com"
                className="reunion-input"
              />
              <p className="reunion-body text-xs opacity-40 mt-1">
                Used for sending email invitations
              </p>
            </div>

            {editError && (
              <p className="reunion-body text-sm text-red-400">{editError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                className="reunion-button flex-1"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={() => setEditing(null)}
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

// Unified data access layer for Family Reunion RSVP
// Tries Supabase first, falls back to localStorage for offline/no-table scenarios.

import { supabase } from "@/integrations/supabase/client";
import { familyMembers, starterOptions, mainCourseOptions, dessertOptions, eventDetails, type FamilyMember } from "./reunion-config";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DelegationAssignment {
  delegateName: string;
  managerCode: string;
}

export interface RsvpRecord {
  family_code: string;
  family_member: string;
  guest_name: string;
  attending: boolean;
  starter: number | null;
  main_course: number | null;
  dessert: number | null;
  submitted_at: string;
}

// ─── localStorage Keys ──────────────────────────────────────────────────────

const LS_DYNAMIC_MEMBERS = "reunion_dynamic_members";
const LS_DELEGATIONS = "reunion_delegations";
const LS_RSVPS = "reunion_rsvps_data";

// ─── Helpers ────────────────────────────────────────────────────────────────

function readLS<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Members ────────────────────────────────────────────────────────────────

export async function getAllMembers(): Promise<FamilyMember[]> {
  const dynamic = readLS<FamilyMember>(LS_DYNAMIC_MEMBERS, []);

  // Try Supabase
  try {
    const { data, error } = await supabase
      .from("reunion_members" as any)
      .select("code, name, email") as any;
    if (!error && data?.length) {
      // Merge Supabase dynamic members into localStorage
      writeLS(LS_DYNAMIC_MEMBERS, data);
      // Dynamic/Supabase overrides come FIRST so they win over static config
      return mergeMembers(familyMembers, data);
    }
  } catch {
    // Supabase unavailable
  }

  return mergeMembers(familyMembers, dynamic);
}

// Merge static config with dynamic overrides. Dynamic entries win for matching codes,
// preserving any edited fields (email, name changes). New dynamic members are appended.
function mergeMembers(staticMembers: FamilyMember[], dynamicMembers: FamilyMember[]): FamilyMember[] {
  const overrides = new Map<string, FamilyMember>();
  for (const m of dynamicMembers) {
    overrides.set(m.code.toLowerCase(), m);
  }

  // Start with static members, applying overrides where they exist
  const result: FamilyMember[] = staticMembers.map((m) => {
    const override = overrides.get(m.code.toLowerCase());
    if (override) {
      overrides.delete(m.code.toLowerCase());
      return { ...m, ...override }; // override wins for name, email, etc.
    }
    return m;
  });

  // Append any dynamic members that aren't in the static list (newly added)
  for (const m of overrides.values()) {
    result.push(m);
  }

  return result;
}

export async function addMember(name: string, addedBy?: string): Promise<FamilyMember> {
  const code = name.toLowerCase().replace(/\s+/g, "") + "2026";
  const member: FamilyMember = { code, name };

  // Save to localStorage immediately
  const dynamic = readLS<FamilyMember>(LS_DYNAMIC_MEMBERS, []);
  const exists = dynamic.some((m) => m.code.toLowerCase() === code.toLowerCase());
  if (!exists) {
    dynamic.push(member);
    writeLS(LS_DYNAMIC_MEMBERS, dynamic);
  }

  // Try Supabase — track who added this member
  try {
    await supabase.from("reunion_members" as any).upsert(
      { code, name, added_by: addedBy ?? "unknown", created_at: new Date().toISOString() } as any,
      { onConflict: "code" as any }
    );
  } catch {
    // localStorage fallback already handled
  }

  return member;
}

export async function updateMember(
  oldCode: string,
  updates: { name?: string; code?: string; email?: string }
): Promise<void> {
  const newCode = updates.code ?? oldCode;

  // Update localStorage
  const dynamic = readLS<FamilyMember>(LS_DYNAMIC_MEMBERS, []);
  const idx = dynamic.findIndex((m) => m.code.toLowerCase() === oldCode.toLowerCase());
  if (idx >= 0) {
    if (updates.name) dynamic[idx].name = updates.name;
    if (updates.code) dynamic[idx].code = updates.code;
    if (updates.email !== undefined) dynamic[idx].email = updates.email || undefined;
    writeLS(LS_DYNAMIC_MEMBERS, dynamic);
  } else {
    // Static member being edited — store override in dynamic list
    const staticMember = familyMembers.find(
      (m) => m.code.toLowerCase() === oldCode.toLowerCase()
    );
    if (staticMember) {
      dynamic.push({
        code: newCode,
        name: updates.name ?? staticMember.name,
        email: updates.email ?? staticMember.email,
      });
      writeLS(LS_DYNAMIC_MEMBERS, dynamic);
    }
  }

  // Try Supabase
  try {
    if (oldCode !== newCode) {
      // Code changed — delete old, insert new
      await supabase.from("reunion_members" as any).delete().eq("code", oldCode);
    }
    await supabase.from("reunion_members" as any).upsert(
      {
        code: newCode,
        name: updates.name ?? oldCode,
        email: updates.email ?? null,
        added_by: "david2026",
        created_at: new Date().toISOString(),
      } as any,
      { onConflict: "code" as any }
    );
  } catch {
    // localStorage fallback handled
  }
}

// ─── Delegations ────────────────────────────────────────────────────────────

export async function getAllDelegations(): Promise<DelegationAssignment[]> {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from("reunion_delegations" as any)
      .select("delegate_name, manager_code") as any;
    if (!error && data?.length) {
      const assignments: DelegationAssignment[] = data.map((d: any) => ({
        delegateName: d.delegate_name,
        managerCode: d.manager_code,
      }));
      writeLS(LS_DELEGATIONS, assignments);
      return assignments;
    }
  } catch {
    // fall through
  }

  return readLS<DelegationAssignment>(LS_DELEGATIONS, []);
}

export async function getDelegationsForManager(managerCode: string): Promise<string[]> {
  const all = await getAllDelegations();
  return all
    .filter((d) => d.managerCode.toLowerCase() === managerCode.toLowerCase())
    .map((d) => d.delegateName);
}

// Set delegations for a person — replaces all existing assignments with new list.
// managerCodes is an array of codes (empty = self-only, no delegations).
export async function setDelegationsForPerson(
  delegateName: string,
  managerCodes: string[]
): Promise<void> {
  // Update localStorage — remove old, add new
  const all = readLS<DelegationAssignment>(LS_DELEGATIONS, []);
  const filtered = all.filter((d) => d.delegateName !== delegateName);
  for (const code of managerCodes) {
    filtered.push({ delegateName, managerCode: code });
  }
  writeLS(LS_DELEGATIONS, filtered);

  // Try Supabase — delete all for this person, then insert new
  try {
    await supabase
      .from("reunion_delegations" as any)
      .delete()
      .eq("delegate_name", delegateName);
    if (managerCodes.length > 0) {
      await supabase.from("reunion_delegations" as any).insert(
        managerCodes.map((code) => ({
          delegate_name: delegateName,
          manager_code: code,
          assigned_by: "admin",
          created_at: new Date().toISOString(),
        })) as any
      );
    }
  } catch {
    // localStorage fallback handled
  }
}

// Legacy single-manager setter (still used by some code paths)
export async function setDelegation(delegateName: string, managerCode: string): Promise<void> {
  const all = await getAllDelegations();
  const existing = all
    .filter((d) => d.delegateName === delegateName)
    .map((d) => d.managerCode);
  if (!existing.includes(managerCode)) {
    await setDelegationsForPerson(delegateName, [...existing, managerCode]);
  }
}

export async function removeDelegation(delegateName: string, managerCode?: string): Promise<void> {
  if (!managerCode) {
    // Remove ALL delegations for this person
    const all = readLS<DelegationAssignment>(LS_DELEGATIONS, []);
    writeLS(LS_DELEGATIONS, all.filter((d) => d.delegateName !== delegateName));
    try {
      await supabase
        .from("reunion_delegations" as any)
        .delete()
        .eq("delegate_name", delegateName);
    } catch {
      // fallback handled
    }
  } else {
    // Remove specific manager for this person
    const all = readLS<DelegationAssignment>(LS_DELEGATIONS, []);
    writeLS(
      LS_DELEGATIONS,
      all.filter(
        (d) => !(d.delegateName === delegateName && d.managerCode === managerCode)
      )
    );
    try {
      await supabase
        .from("reunion_delegations" as any)
        .delete()
        .eq("delegate_name", delegateName)
        .eq("manager_code", managerCode);
    } catch {
      // fallback handled
    }
  }
}

// ─── RSVPs ──────────────────────────────────────────────────────────────────

export async function getAllRsvps(): Promise<RsvpRecord[]> {
  // Try Supabase
  try {
    const { data, error } = await supabase
      .from("reunion_rsvps" as any)
      .select("*") as any;
    if (!error && data?.length) {
      writeLS(LS_RSVPS, data);
      return data;
    }
  } catch {
    // fall through
  }

  return readLS<RsvpRecord>(LS_RSVPS, []);
}

export async function getRsvpsForMember(familyCode: string): Promise<RsvpRecord[]> {
  const all = await getAllRsvps();
  return all.filter((r) => r.family_code.toLowerCase() === familyCode.toLowerCase());
}

// ─── Menu helpers ───────────────────────────────────────────────────────────

export function getMenuItemName(
  category: "starter" | "main" | "dessert",
  id: number | null
): string {
  if (id === null) return "\u2014";
  const options =
    category === "starter" ? starterOptions :
    category === "main" ? mainCourseOptions :
    dessertOptions;
  return options.find((o) => o.id === id)?.name ?? "\u2014";
}

// ─── Email subscriptions ────────────────────────────────────────────────────

export async function getSubscription(familyCode: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("reunion_subscriptions" as any)
      .select("subscribed")
      .eq("family_code", familyCode)
      .single() as any;
    return data?.subscribed ?? false;
  } catch {
    return false;
  }
}

export async function setSubscription(familyCode: string, subscribed: boolean): Promise<void> {
  await supabase.from("reunion_subscriptions" as any).upsert(
    { family_code: familyCode, subscribed, updated_at: new Date().toISOString() } as any,
    { onConflict: "family_code" as any }
  );
}

export async function getSubscribedEmails(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("reunion_subscriptions" as any)
      .select("family_code")
      .eq("subscribed", true) as any;
    if (!data?.length) return [];

    const members = await getAllMembers();
    const subscribedCodes = new Set(data.map((d: any) => d.family_code.toLowerCase()));
    return members
      .filter((m) => m.email && subscribedCodes.has(m.code.toLowerCase()))
      .map((m) => m.email!);
  } catch {
    return [];
  }
}

// ─── Invite helpers ─────────────────────────────────────────────────────────

const SITE_URL = "https://david-martin.ca";

export function getInviteUrl(member: FamilyMember): string {
  return `${SITE_URL}/reunion?code=${encodeURIComponent(member.code)}`;
}

export function getInviteEmailBody(member: FamilyMember): string {
  const url = getInviteUrl(member);
  return [
    `Hi ${member.name},`,
    ``,
    `You\u2019re invited to the ${eventDetails.title}!`,
    ``,
    `\ud83d\udcc5 ${eventDetails.date}`,
    `\u23f0 ${eventDetails.time}`,
    `\ud83d\udccd ${eventDetails.location}, ${eventDetails.address}`,
    ``,
    `Please RSVP and choose your meal by ${eventDetails.rsvpDeadline} using your personal link:`,
    `${url}`,
    ``,
    `Your access code is: ${member.code}`,
    ``,
    `We hope to see you there!`,
    ``,
    `With love,`,
    `The Jorgensen & Martin Family`,
    ``,
    `Questions? Contact ${eventDetails.contactEmail} or call ${eventDetails.contactPhone}`,
  ].join("\n");
}

export function getAllInviteLinks(members: FamilyMember[]): string {
  return members
    .map((m) => `${m.name}: ${getInviteUrl(m)}`)
    .join("\n");
}

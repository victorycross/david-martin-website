import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventDetails, type FamilyMember } from "@/data/reunion-config";
import {
  getAllMembers,
  getAllRsvps,
  getAllDelegations,
  type RsvpRecord,
  type DelegationAssignment,
} from "@/data/reunion-data";
import { AdminStatusTable } from "./AdminStatusTable";
import { AdminMealSummary } from "./AdminMealSummary";
import { AdminDelegation } from "./AdminDelegation";
import { AdminAddMember } from "./AdminAddMember";
import { AdminNews } from "./AdminNews";
import { AdminHelp } from "./AdminHelp";

function CollapsibleSection({ title, description, children, defaultOpen = false }: {
  title: string; description: string; children: ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 mb-2 text-left w-full">
        <span className={`reunion-collapse-arrow ${open ? "reunion-collapse-arrow-open" : ""}`}>&#x25B6;</span>
        <h2 className="reunion-heading text-xl">{title}</h2>
      </button>
      {open && (
        <>
          <p className="reunion-body text-sm opacity-60 mb-4 ml-5">{description}</p>
          <div className="ml-0">{children}</div>
        </>
      )}
    </div>
  );
}

interface AdminPanelProps {
  onBack: () => void;
  adminCode?: string;
  adminName?: string;
  onEditGuest?: (guestName: string) => void;
}

export function AdminPanel({ onBack, adminCode, adminName, onEditGuest }: AdminPanelProps) {
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [delegations, setDelegations] = useState<DelegationAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const loadData = useCallback(async () => {
    const [members, rsvpData, delegationData] = await Promise.all([
      getAllMembers(),
      getAllRsvps(),
      getAllDelegations(),
    ]);
    setAllMembers(members);
    setRsvps(rsvpData);
    setDelegations(delegationData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="reunion-page min-h-screen flex items-center justify-center">
        <div className="reunion-grain" />
        <div className="relative z-10 text-center">
          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="reunion-body text-sm opacity-50">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reunion-page min-h-screen py-8 px-4">
      <div className="reunion-grain" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="reunion-title text-3xl sm:text-4xl mb-1">
              Admin Panel
            </h1>
            <p className="reunion-subtitle text-sm tracking-widest uppercase">
              {eventDetails.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp((h) => !h)}
              className="reunion-invite-btn"
              title="Admin Guide"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </button>
            <button
              onClick={onBack}
              className="reunion-button-outline px-4 py-2 rounded-lg text-sm"
            >
              My RSVP
            </button>
          </div>
        </div>

        {showHelp ? (
          <AdminHelp />
        ) : (
        /* Tabs */
        <Tabs defaultValue="status" className="reunion-tabs">
          <TabsList className="reunion-tabs-list">
            <TabsTrigger value="status" className="reunion-tab-trigger">
              Status
            </TabsTrigger>
            <TabsTrigger value="meals" className="reunion-tab-trigger">
              Meals &amp; Export
            </TabsTrigger>
            <TabsTrigger value="manage" className="reunion-tab-trigger">
              Manage
            </TabsTrigger>
            <TabsTrigger value="news" className="reunion-tab-trigger">
              News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="mt-6">
            <AdminStatusTable allMembers={allMembers} rsvps={rsvps} onEditGuest={onEditGuest} onDataChange={loadData} />
          </TabsContent>

          <TabsContent value="meals" className="mt-6">
            <AdminMealSummary rsvps={rsvps} />
          </TabsContent>

          <TabsContent value="manage" className="mt-6 space-y-8">
            <CollapsibleSection
              title="Guest Delegation"
              description="Assign family members to be managed by another person. The manager will see delegated guests on their RSVP form."
            >
              <AdminDelegation
                allMembers={allMembers}
                delegations={delegations}
                onUpdate={loadData}
              />
            </CollapsibleSection>

            <div className="border-t border-white/10 pt-6">
              <CollapsibleSection
                title="Add Family Members"
                description="Add new people to the RSVP system. They'll receive an access code to log in."
              >
                <AdminAddMember allMembers={allMembers} onUpdate={loadData} adminCode={adminCode} />
              </CollapsibleSection>
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <CollapsibleSection
              title="News &amp; Updates"
              description="Post updates that appear on the reunion page for all family members to see."
            >
              <AdminNews adminCode={adminCode ?? ""} adminName={adminName ?? "Admin"} />
            </CollapsibleSection>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}

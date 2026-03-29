import { useState, useEffect, useCallback } from "react";
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

interface AdminPanelProps {
  onBack: () => void;
  adminCode?: string;
}

export function AdminPanel({ onBack, adminCode }: AdminPanelProps) {
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [delegations, setDelegations] = useState<DelegationAssignment[]>([]);
  const [loading, setLoading] = useState(true);

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
          <button
            onClick={onBack}
            className="reunion-button-outline px-4 py-2 rounded-lg text-sm"
          >
            My RSVP
          </button>
        </div>

        {/* Tabs */}
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
          </TabsList>

          <TabsContent value="status" className="mt-6">
            <AdminStatusTable allMembers={allMembers} rsvps={rsvps} />
          </TabsContent>

          <TabsContent value="meals" className="mt-6">
            <AdminMealSummary rsvps={rsvps} />
          </TabsContent>

          <TabsContent value="manage" className="mt-6 space-y-8">
            <div>
              <h2 className="reunion-heading text-xl mb-4">
                Guest Delegation
              </h2>
              <p className="reunion-body text-sm opacity-60 mb-4">
                Assign family members to be managed by another person. The
                manager will see delegated guests on their RSVP form.
              </p>
              <AdminDelegation
                allMembers={allMembers}
                delegations={delegations}
                onUpdate={loadData}
              />
            </div>

            <div className="pt-6 border-t border-white/10">
              <h2 className="reunion-heading text-xl mb-4">
                Add Family Members
              </h2>
              <p className="reunion-body text-sm opacity-60 mb-4">
                Add new people to the RSVP system. They&rsquo;ll receive an
                access code to log in.
              </p>
              <AdminAddMember allMembers={allMembers} onUpdate={loadData} adminCode={adminCode} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getMenuItemName, type RsvpRecord } from "@/data/reunion-data";
import { generateReunionPdf } from "@/utils/reunion-pdf";

interface AdminMealSummaryProps {
  rsvps: RsvpRecord[];
}

type SortKey = "name" | "rsvp" | "starter" | "main" | "dessert";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className={`inline ml-1 ${active ? "opacity-100" : "opacity-30"}`}>
      <path d="M5 2L8 6H2Z" fill={active && dir === "asc" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" />
      <path d="M5 8L2 4H8Z" fill={active && dir === "desc" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function AdminMealSummary({ rsvps }: AdminMealSummaryProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [collapsed, setCollapsed] = useState(false);

  const attending = rsvps.filter((r) => r.attending).length;
  const declined = rsvps.filter((r) => !r.attending).length;

  const sorted = useMemo(() => {
    const list = [...rsvps];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.guest_name.localeCompare(b.guest_name);
      else if (sortKey === "rsvp") cmp = (a.attending ? 1 : 0) - (b.attending ? 1 : 0);
      else if (sortKey === "starter") cmp = (a.starter ?? 0) - (b.starter ?? 0);
      else if (sortKey === "main") cmp = (a.main_course ?? 0) - (b.main_course ?? 0);
      else if (sortKey === "dessert") cmp = (a.dessert ?? 0) - (b.dessert ?? 0);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [rsvps, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div>
      {/* Summary counts */}
      <div className="reunion-info-bar mb-6 flex items-center justify-between">
        <button onClick={() => setCollapsed((c) => !c)} className="reunion-body text-sm text-left flex items-center gap-2">
          <span className={`reunion-collapse-arrow ${collapsed ? "" : "reunion-collapse-arrow-open"}`}>&#x25B6;</span>
          <span className="reunion-heading text-lg">{attending}</span> attending
          <span className="opacity-40 mx-2">|</span>
          <span className="reunion-heading text-lg">{declined}</span> declined
          <span className="opacity-40 mx-2">|</span>
          <span className="reunion-heading text-lg">{rsvps.length}</span> total
        </button>
        <Button
          onClick={() => generateReunionPdf(rsvps)}
          className="reunion-button"
          disabled={rsvps.length === 0}
        >
          Export PDF
        </Button>
      </div>

      {!collapsed && (
        <div className="overflow-x-auto">
          <table className="reunion-admin-table w-full">
            <thead>
              <tr>
                <th className="text-left cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Guest Name <SortIcon active={sortKey === "name"} dir={sortDir} />
                </th>
                <th className="text-center cursor-pointer select-none" onClick={() => toggleSort("rsvp")}>
                  RSVP <SortIcon active={sortKey === "rsvp"} dir={sortDir} />
                </th>
                <th className="text-left cursor-pointer select-none" onClick={() => toggleSort("starter")}>
                  Starter <SortIcon active={sortKey === "starter"} dir={sortDir} />
                </th>
                <th className="text-left cursor-pointer select-none" onClick={() => toggleSort("main")}>
                  Main <SortIcon active={sortKey === "main"} dir={sortDir} />
                </th>
                <th className="text-left cursor-pointer select-none" onClick={() => toggleSort("dessert")}>
                  Dessert <SortIcon active={sortKey === "dessert"} dir={sortDir} />
                </th>
              </tr>
            </thead>
            <tbody>
              {rsvps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center reunion-body text-sm opacity-50 py-8">
                    No RSVPs submitted yet
                  </td>
                </tr>
              ) : (
                sorted.map((r, i) => (
                  <tr key={i}>
                    <td className="reunion-heading text-sm">{r.guest_name}</td>
                    <td className="text-center">
                      {r.attending ? (
                        <span className="reunion-status-submitted">Yes</span>
                      ) : (
                        <span className="reunion-status-declined">No</span>
                      )}
                    </td>
                    <td className="reunion-body text-xs">
                      {r.attending ? getMenuItemName("starter", r.starter) : "\u2014"}
                    </td>
                    <td className="reunion-body text-xs">
                      {r.attending ? getMenuItemName("main", r.main_course) : "\u2014"}
                    </td>
                    <td className="reunion-body text-xs">
                      {r.attending ? getMenuItemName("dessert", r.dessert) : "\u2014"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

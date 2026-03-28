import { Button } from "@/components/ui/button";
import { getMenuItemName, type RsvpRecord } from "@/data/reunion-data";
import { generateReunionPdf } from "@/utils/reunion-pdf";

interface AdminMealSummaryProps {
  rsvps: RsvpRecord[];
}

export function AdminMealSummary({ rsvps }: AdminMealSummaryProps) {
  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);

  return (
    <div>
      {/* Summary counts */}
      <div className="reunion-info-bar mb-6 flex items-center justify-between">
        <div className="reunion-body text-sm">
          <span className="reunion-heading text-lg">{attending.length}</span>{" "}
          attending
          <span className="opacity-40 mx-3">|</span>
          <span className="reunion-heading text-lg">{declined.length}</span>{" "}
          declined
          <span className="opacity-40 mx-3">|</span>
          <span className="reunion-heading text-lg">{rsvps.length}</span>{" "}
          total
        </div>
        <Button
          onClick={() => generateReunionPdf(rsvps)}
          className="reunion-button"
          disabled={rsvps.length === 0}
        >
          Export PDF
        </Button>
      </div>

      {/* Meal table */}
      <div className="overflow-x-auto">
        <table className="reunion-admin-table w-full">
          <thead>
            <tr>
              <th className="text-left">Guest Name</th>
              <th className="text-center">RSVP</th>
              <th className="text-left">Starter</th>
              <th className="text-left">Main Course</th>
              <th className="text-left">Dessert</th>
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
              rsvps.map((r, i) => (
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
    </div>
  );
}

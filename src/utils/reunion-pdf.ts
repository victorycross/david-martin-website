// PDF export for Family Reunion RSVP meal summary
// Generates a formatted PDF matching the original invitation table layout.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { starterOptions, mainCourseOptions, dessertOptions, eventDetails } from "@/data/reunion-config";
import { getMenuItemName, type RsvpRecord } from "@/data/reunion-data";
import { getMealCounts, type MealCounts } from "./reunion-meal-counts";

export function generateReunionPdf(rsvps: RsvpRecord[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const counts = getMealCounts(rsvps);

  // Title
  doc.setFontSize(18);
  doc.text(`${eventDetails.title} \u2014 RSVP Summary`, 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `${eventDetails.date} | ${eventDetails.time} | ${eventDetails.location}, ${eventDetails.address}`,
    14, 26
  );
  doc.text(`Exported: ${new Date().toLocaleDateString()}`, 14, 32);
  doc.setTextColor(0);

  // ── Meal Totals Summary ──
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Meal Order Summary", 14, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const summaryRows: string[][] = [];

  summaryRows.push(["", "STARTERS", "", ""]);
  counts.starters.forEach((c) => summaryRows.push(["", c.name, String(c.count), ""]));
  summaryRows.push(["", "", "", ""]);

  summaryRows.push(["", "MAIN COURSES", "", ""]);
  counts.mains.forEach((c) => summaryRows.push(["", c.name, String(c.count), ""]));
  summaryRows.push(["", "", "", ""]);

  summaryRows.push(["", "DESSERTS", "", ""]);
  counts.desserts.forEach((c) => summaryRows.push(["", c.name, String(c.count), ""]));

  autoTable(doc, {
    startY: 46,
    head: [["", "Item", "Qty", ""]],
    body: summaryRows,
    theme: "plain",
    headStyles: {
      fillColor: [40, 35, 30],
      textColor: [240, 230, 216],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 120 },
      2: { cellWidth: 15, halign: "center", fontStyle: "bold" },
      3: { cellWidth: 10 },
    },
    styles: { cellPadding: 1.5 },
    didParseCell: (data: any) => {
      // Bold section headers
      const text = data.cell?.raw;
      if (typeof text === "string" && text === text.toUpperCase() && text.length > 2) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [100, 80, 50];
      }
    },
  });

  let summaryEnd = (doc as any).lastAutoTable?.finalY ?? 100;
  summaryEnd += 4;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Attending: ${attending.length}  |  Declined: ${declined.length}  |  Total Responses: ${rsvps.length}`,
    14, summaryEnd
  );

  // ── Guest Detail Table ──
  summaryEnd += 10;
  doc.setFontSize(11);
  doc.text("Guest Details", 14, summaryEnd);

  const tableRows = rsvps.map((r) => [
    r.guest_name,
    "", // Table # placeholder
    r.attending ? "Yes" : "No",
    r.attending ? getMenuItemName("starter", r.starter) : "\u2014",
    r.attending ? getMenuItemName("main", r.main_course) : "\u2014",
    r.attending ? getMenuItemName("dessert", r.dessert) : "\u2014",
  ]);

  autoTable(doc, {
    startY: summaryEnd + 4,
    head: [["Guest Name", "Table #", "RSVP", "Starter", "Main Course", "Dessert"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [40, 35, 30],
      textColor: [240, 230, 216],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 245, 240] },
    styles: { cellPadding: 3 },
    columnStyles: {
      1: { cellWidth: 20, halign: "center" }, // Table # column
    },
  });

  doc.save("reunion-rsvps-2026.pdf");
}

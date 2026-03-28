// PDF export for Family Reunion RSVP meal summary
// Generates a formatted PDF matching the original invitation table layout.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { starterOptions, mainCourseOptions, dessertOptions, eventDetails } from "@/data/reunion-config";
import { getMenuItemName, type RsvpRecord } from "@/data/reunion-data";

export function generateReunionPdf(rsvps: RsvpRecord[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });

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

  // Main RSVP table
  const tableRows = rsvps.map((r) => [
    r.guest_name,
    r.attending ? "Yes" : "No",
    r.attending ? getMenuItemName("starter", r.starter) : "\u2014",
    r.attending ? getMenuItemName("main", r.main_course) : "\u2014",
    r.attending ? getMenuItemName("dessert", r.dessert) : "\u2014",
  ]);

  autoTable(doc, {
    startY: 38,
    head: [["Guest Name", "RSVP", "Starter Option", "Main Course Option", "Dessert Option"]],
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
  });

  // Menu legends below the table
  const finalY = (doc as any).lastAutoTable?.finalY ?? 120;
  let y = finalY + 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Menu Selection Reference", 14, y);
  y += 8;

  // Starter options
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Starter Options", 14, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  for (const opt of starterOptions) {
    doc.text(`${opt.id}. ${opt.name}`, 18, y);
    y += 4.5;
  }
  y += 3;

  // Main course options
  doc.setFont("helvetica", "bold");
  doc.text("Main Course Options", 14, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  for (const opt of mainCourseOptions) {
    doc.text(`${opt.id}. ${opt.name}`, 18, y);
    y += 4.5;
  }
  y += 3;

  // Dessert options
  doc.setFont("helvetica", "bold");
  doc.text("Dessert Options", 14, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  for (const opt of dessertOptions) {
    doc.text(`${opt.id}. ${opt.name}`, 18, y);
    y += 4.5;
  }

  // Summary counts
  const attending = rsvps.filter((r) => r.attending).length;
  const declined = rsvps.filter((r) => !r.attending).length;
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Attending: ${attending}  |  Declined: ${declined}  |  Total Guests: ${rsvps.length}`, 14, y);

  doc.save("reunion-rsvps-2026.pdf");
}

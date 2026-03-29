// Family Reunion 2026 — RSVP Configuration
// Each family member gets a unique access code to log in and submit their RSVP.
// To add a new family member, add an entry below with a unique code.

export interface FamilyMember {
  code: string;
  name: string;
  email?: string;
}

export const familyMembers: FamilyMember[] = [
  { code: "ingrid2026", name: "Ingrid" },
  { code: "james2026", name: "James" },
  { code: "lisa2026", name: "Lisa" },
  { code: "dan2026", name: "Dan" },
  { code: "luke2026", name: "Luke" },
  { code: "jack2026", name: "Jack" },
  { code: "david2026", name: "David" },
  { code: "jennifer2026", name: "Jennifer" },
  { code: "callum2026", name: "Callum" },
  { code: "kate2026", name: "Kate" },
];

export interface MenuOption {
  id: number;
  name: string;
}

export const starterOptions: MenuOption[] = [
  { id: 1, name: "Roasted Red Pepper Soup" },
  { id: 2, name: "Broccoli Cheddar Soup" },
  { id: 3, name: "Beet and Goat Cheese Salad" },
  { id: 4, name: "Cesar Salad" },
];

export const mainCourseOptions: MenuOption[] = [
  { id: 1, name: "Mediterranean Salmon served over rice pilaf and vegetable medley" },
  { id: 2, name: "8 oz Sirloin with mashed potatoes and seasonal vegetables (med rare if not specified)" },
  { id: 3, name: "Balsamic Chicken with mashed potatoes and seasonal vegetables" },
  { id: 4, name: "Thai Curry Bowl (vegetarian)" },
  { id: 5, name: "Chicken/Vegetarian Alfredo Pasta" },
  { id: 6, name: "Burger and Fries (kids meal)" },
];

export const dessertOptions: MenuOption[] = [
  { id: 1, name: "Chocolate Lava Cake" },
  { id: 2, name: "Caramel Cheesecake" },
  { id: 3, name: "Ice Cream (kids dessert)" },
];

// Admin configuration — multiple admins supported
export const ADMIN_CODES = ["david2026", "ken2026"];

export function isAdmin(member: FamilyMember): boolean {
  return ADMIN_CODES.includes(member.code.toLowerCase());
}

export const eventDetails = {
  title: "2026 Family Reunion",
  date: "Sunday, May 3, 2026",
  time: "3:00 p.m. \u2013 7:00 p.m.",
  location: "Kelsey\u2019s 2nd Floor",
  address: "371 First Street, Collingwood, ON, L9Y 1B3",
  rsvpDeadline: "April 7, 2026",
  contactEmail: "ken_jorgensen33@yahoo.ca",
  contactPhone: "647-882-0275",
};

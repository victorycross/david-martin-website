// Shared meal count calculator for PDF export and admin UI

import { starterOptions, mainCourseOptions, dessertOptions } from "@/data/reunion-config";
import type { RsvpRecord } from "@/data/reunion-data";

export interface MealCount {
  id: number;
  name: string;
  count: number;
}

export interface MealCounts {
  starters: MealCount[];
  mains: MealCount[];
  desserts: MealCount[];
}

export function getMealCounts(rsvps: RsvpRecord[]): MealCounts {
  const attending = rsvps.filter((r) => r.attending);

  const countByField = (
    field: "starter" | "main_course" | "dessert",
    options: { id: number; name: string }[]
  ): MealCount[] => {
    const map = new Map<number, number>();
    for (const r of attending) {
      const val = r[field];
      if (val != null) map.set(val, (map.get(val) ?? 0) + 1);
    }
    return options
      .map((opt) => ({ id: opt.id, name: opt.name, count: map.get(opt.id) ?? 0 }))
      .filter((c) => c.count > 0);
  };

  return {
    starters: countByField("starter", starterOptions),
    mains: countByField("main_course", mainCourseOptions),
    desserts: countByField("dessert", dessertOptions),
  };
}

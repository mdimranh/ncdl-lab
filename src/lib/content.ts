import { cache } from "react";
import { db } from "@/db";
import { siteSettings, type SiteSettings } from "@/db/schema";

const fallback: SiteSettings = {
  id: 1,
  labName: "Neuromorphic Chip Design Laboratory",
  labNameKo: "",
  shortName: "NCDL",
  institution: "Department of Electrical & Electronic Engineering",
  institutionKo: "",
  tagline: "Brain-inspired silicon for the next generation of intelligent machines.",
  taglineKo: "",
  motto: "Learn from the brain. Build it in silicon.",
  mottoKo: "",
  mission: "",
  missionKo: "",
  foundingYear: 2018,
  address: "",
  addressKo: "",
  phone: "",
  fax: "",
  email: "",
  officeHours: "",
  officeHoursKo: "",
  mapQuery: "",
  linkedinUrl: null,
  scholarUrl: null,
  githubUrl: null,
  youtubeUrl: null,
  updatedAt: new Date(),
};

/** Site-wide settings, memoised per request. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const [row] = await db.select().from(siteSettings).limit(1);
    return row ?? fallback;
  } catch {
    return fallback;
  }
});

export {
  memberCategoryLabels,
  navItems,
  positionTypeLabels,
  publicationTypeLabels,
} from "./site-config";

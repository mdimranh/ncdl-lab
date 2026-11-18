/**
 * Client-safe site constants. This module must never import the database,
 * because client components (navigation, header) depend on it.
 */

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Members", href: "/members" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const memberGroups = [
  "professor",
  "phd",
  "masters",
  "alumni",
  "collaborations",
] as const;

export type MemberGroup = (typeof memberGroups)[number];

export const defaultMemberGroup: MemberGroup = "professor";

export function isMemberGroup(value: string | null | undefined): value is MemberGroup {
  return memberGroups.includes(value as MemberGroup);
}

export const publicationTypeLabels: Record<string, string> = {
  journal: "Journal",
  conference: "Conference",
  chip: "Chip Design",
  workshop: "Workshop",
  certificate: "Certificate",
};

export const memberCategoryLabels: Record<string, string> = {
  professor: "Faculty",
  phd: "PhD Researchers",
  masters: "Master's Students",
  alumni: "Alumni",
};

export const positionTypeLabels: Record<string, string> = {
  phd: "PhD",
  masters: "Master's",
  postdoc: "Postdoc",
  "research-assistant": "Research Assistant",
  internship: "Internship",
};

import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ---------------------------------- enums --------------------------------- */

export const userRole = pgEnum("user_role", ["admin", "faculty"]);

export const memberCategory = pgEnum("member_category", [
  "professor",
  "phd",
  "masters",
  "alumni",
]);

export const publicationType = pgEnum("publication_type", [
  "journal",
  "conference",
  "chip",
  "workshop",
  "certificate",
]);

export const projectStatus = pgEnum("project_status", ["ongoing", "completed"]);

export const positionType = pgEnum("position_type", [
  "phd",
  "masters",
  "postdoc",
  "research-assistant",
  "internship",
]);

/* ---------------------------------- users --------------------------------- */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("faculty"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* -------------------------------- members --------------------------------- */

export type EducationEntry = {
  degree: string;
  institution: string;
  year: string;
};

export type FigureEntry = {
  imageUrl: string;
  caption: string;
};

export const members = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    nameKo: text("name_ko"),
    category: memberCategory("category").notNull().default("phd"),
    designation: text("designation").notNull().default(""),
    designationKo: text("designation_ko"),
    photoUrl: text("photo_url"),
    email: text("email"),
    phone: text("phone"),
    bio: text("bio").notNull().default(""),
    bioKo: text("bio_ko"),
    interests: jsonb("interests").$type<string[]>().notNull().default([]),
    interestsKo: jsonb("interests_ko").$type<string[]>().notNull().default([]),
    education: jsonb("education")
      .$type<EducationEntry[]>()
      .notNull()
      .default([]),
    websiteUrl: text("website_url"),
    scholarUrl: text("scholar_url"),
    linkedinUrl: text("linkedin_url"),
    orcidUrl: text("orcid_url"),
    joinedYear: integer("joined_year"),
    alumniPosition: text("alumni_position"),
    alumniPositionKo: text("alumni_position_ko"),
    displayOrder: integer("display_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("members_slug_idx").on(table.slug),
    index("members_category_idx").on(table.category),
  ],
);

/* ------------------------------ research areas ---------------------------- */

export const researchAreas = pgTable("research_areas", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleKo: text("title_ko"),
  tagline: text("tagline").notNull().default(""),
  taglineKo: text("tagline_ko"),
  icon: text("icon").notNull().default("cpu"),
  summary: text("summary").notNull().default(""),
  summaryKo: text("summary_ko"),
  overview: text("overview").notNull().default(""),
  overviewKo: text("overview_ko"),
  objectives: jsonb("objectives").$type<string[]>().notNull().default([]),
  objectivesKo: jsonb("objectives_ko").$type<string[]>().notNull().default([]),
  methodologies: jsonb("methodologies").$type<string[]>().notNull().default([]),
  methodologiesKo: jsonb("methodologies_ko").$type<string[]>().notNull().default([]),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  figures: jsonb("figures").$type<FigureEntry[]>().notNull().default([]),
  publishedAt: date("published_at"),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

/* -------------------------------- projects -------------------------------- */

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  areaId: integer("area_id").references(() => researchAreas.id, {
    onDelete: "set null",
  }),
  status: projectStatus("status").notNull().default("ongoing"),
  summary: text("summary").notNull().default(""),
  description: text("description").notNull().default(""),
  funding: text("funding"),
  collaborators: text("collaborators"),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  featured: boolean("featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------ publications ------------------------------ */

export const publications = pgTable(
  "publications",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    titleKo: text("title_ko"),
    authors: text("authors").notNull(),
    venue: text("venue").notNull().default(""),
    venueKo: text("venue_ko"),
    type: publicationType("type").notNull().default("journal"),
    year: integer("year").notNull(),
    doi: text("doi"),
    url: text("url"),
    imageUrl: text("image_url"),
    abstract: text("abstract"),
    abstractKo: text("abstract_ko"),
    areaId: integer("area_id").references(() => researchAreas.id, {
      onDelete: "set null",
    }),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("publications_year_idx").on(table.year),
    index("publications_type_idx").on(table.type),
  ],
);

/* ---------------------------------- news ---------------------------------- */

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleKo: text("title_ko"),
  excerpt: text("excerpt").notNull().default(""),
  excerptKo: text("excerpt_ko"),
  content: text("content").notNull().default(""),
  contentKo: text("content_ko"),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  authorName: text("author_name").notNull().default("NCDL"),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  isPublished: boolean("is_published").notNull().default(true),
});

/* -------------------------------- positions ------------------------------- */

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleKo: text("title_ko"),
  type: positionType("type").notNull().default("phd"),
  description: text("description").notNull().default(""),
  descriptionKo: text("description_ko"),
  requirements: jsonb("requirements").$type<string[]>().notNull().default([]),
  fundingNote: text("funding_note"),
  deadline: date("deadline"),
  isOpen: boolean("is_open").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
});

/* --------------------------------- gallery -------------------------------- */

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  caption: text("caption").notNull().default(""),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

/* ------------------------------ collaborations ---------------------------- */

export const collaborations = pgTable("collaborations", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  country: text("country").notNull().default(""),
  description: text("description").notNull().default(""),
  websiteUrl: text("website_url"),
  displayOrder: integer("display_order").notNull().default(0),
});

/* ------------------------------ site settings ----------------------------- */

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  labName: text("lab_name").notNull().default("Neuromorphic Chip Design Laboratory"),
  labNameKo: text("lab_name_ko").notNull().default(""),
  shortName: text("short_name").notNull().default("NCDL"),
  institution: text("institution").notNull().default(""),
  institutionKo: text("institution_ko").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  taglineKo: text("tagline_ko").notNull().default(""),
  motto: text("motto").notNull().default(""),
  mottoKo: text("motto_ko").notNull().default(""),
  mission: text("mission").notNull().default(""),
  missionKo: text("mission_ko").notNull().default(""),
  foundingYear: integer("founding_year").notNull().default(2018),
  address: text("address").notNull().default(""),
  addressKo: text("address_ko").notNull().default(""),
  phone: text("phone").notNull().default(""),
  fax: text("fax").notNull().default(""),
  email: text("email").notNull().default(""),
  officeHours: text("office_hours").notNull().default(""),
  officeHoursKo: text("office_hours_ko").notNull().default(""),
  mapQuery: text("map_query").notNull().default(""),
  linkedinUrl: text("linkedin_url"),
  scholarUrl: text("scholar_url"),
  githubUrl: text("github_url"),
  youtubeUrl: text("youtube_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ---------------------------------- types --------------------------------- */

export type User = typeof users.$inferSelect;
export type Member = typeof members.$inferSelect;
export type ResearchArea = typeof researchAreas.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type NewsItem = typeof news.$inferSelect;
export type Position = typeof positions.$inferSelect;
export type GalleryItem = typeof gallery.$inferSelect;
export type Collaboration = typeof collaborations.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;

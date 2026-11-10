CREATE TYPE "public"."member_category" AS ENUM('professor', 'phd', 'masters', 'alumni');--> statement-breakpoint
CREATE TYPE "public"."position_type" AS ENUM('phd', 'masters', 'postdoc', 'research-assistant', 'internship');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."publication_type" AS ENUM('journal', 'conference', 'chip', 'workshop', 'certificate');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'faculty');--> statement-breakpoint
CREATE TABLE "collaborations" (
	"id" serial PRIMARY KEY NOT NULL,
	"institution" text NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"website_url" text,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"caption" text DEFAULT '' NOT NULL,
	"image_url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" "member_category" DEFAULT 'phd' NOT NULL,
	"designation" text DEFAULT '' NOT NULL,
	"photo_url" text,
	"email" text,
	"phone" text,
	"bio" text DEFAULT '' NOT NULL,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"website_url" text,
	"scholar_url" text,
	"linkedin_url" text,
	"orcid_url" text,
	"joined_year" integer,
	"alumni_position" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"image_url" text,
	"author_name" text DEFAULT 'NCDL' NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" "position_type" DEFAULT 'phd' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"funding_note" text,
	"deadline" date,
	"is_open" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"area_id" integer,
	"status" "project_status" DEFAULT 'ongoing' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"funding" text,
	"collaborators" text,
	"start_year" integer,
	"end_year" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"authors" text NOT NULL,
	"venue" text DEFAULT '' NOT NULL,
	"type" "publication_type" DEFAULT 'journal' NOT NULL,
	"year" integer NOT NULL,
	"doi" text,
	"url" text,
	"abstract" text,
	"area_id" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT 'cpu' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"overview" text DEFAULT '' NOT NULL,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"methodologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	CONSTRAINT "research_areas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"lab_name" text DEFAULT 'Neuromorphic Chip Design Laboratory' NOT NULL,
	"short_name" text DEFAULT 'NCDL' NOT NULL,
	"institution" text DEFAULT '' NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"motto" text DEFAULT '' NOT NULL,
	"mission" text DEFAULT '' NOT NULL,
	"founding_year" integer DEFAULT 2018 NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"fax" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"office_hours" text DEFAULT '' NOT NULL,
	"map_query" text DEFAULT '' NOT NULL,
	"linkedin_url" text,
	"scholar_url" text,
	"github_url" text,
	"youtube_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'faculty' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_area_id_research_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."research_areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "publications_area_id_research_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."research_areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "members_slug_idx" ON "members" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "members_category_idx" ON "members" USING btree ("category");--> statement-breakpoint
CREATE INDEX "publications_year_idx" ON "publications" USING btree ("year");--> statement-breakpoint
CREATE INDEX "publications_type_idx" ON "publications" USING btree ("type");
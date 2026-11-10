ALTER TABLE "members" ADD COLUMN "name_ko" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "designation_ko" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "bio_ko" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "interests_ko" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "alumni_position_ko" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "title_ko" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "excerpt_ko" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "content_ko" text;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "title_ko" text;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "tagline_ko" text;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "summary_ko" text;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "overview_ko" text;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "objectives_ko" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "methodologies_ko" jsonb DEFAULT '[]'::jsonb NOT NULL;
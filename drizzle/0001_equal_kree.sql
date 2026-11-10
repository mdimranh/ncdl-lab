ALTER TABLE "news" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "figures" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "research_areas" ADD COLUMN "published_at" date;
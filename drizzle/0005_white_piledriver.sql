ALTER TABLE "members" ADD COLUMN "experience" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "patents" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "member_projects" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "mobile" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "office_address" text;
ALTER TABLE "positions" ADD COLUMN "title_ko" text;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "description_ko" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "lab_name_ko" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "institution_ko" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "tagline_ko" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "motto_ko" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "mission_ko" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "address_ko" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "office_hours_ko" text DEFAULT '' NOT NULL;
ALTER TABLE "fields" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;
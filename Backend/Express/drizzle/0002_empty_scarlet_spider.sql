CREATE TABLE "fields" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"label" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"placeholder" text,
	"required" boolean DEFAULT false NOT NULL,
	"options" jsonb,
	"section_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fields" ADD CONSTRAINT "fields_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;
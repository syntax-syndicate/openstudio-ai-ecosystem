CREATE TYPE "public"."integration_state_platform" AS ENUM('YOUTUBE');--> statement-breakpoint
CREATE TABLE "integration_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"organization_id" varchar(191) NOT NULL,
	"creator_id" varchar(191) NOT NULL,
	"platform" "integration_state_platform" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "youtube_integration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"organization_id" varchar(191) NOT NULL,
	"creator_id" varchar(191) NOT NULL,
	"access_token" varchar(191) NOT NULL,
	"refresh_token" varchar(191) NOT NULL,
	"token_type" varchar(191) NOT NULL,
	"scope" varchar(191) NOT NULL,
	"expiry_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integration_state" ADD CONSTRAINT "integration_state_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_state" ADD CONSTRAINT "integration_state_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youtube_integration" ADD CONSTRAINT "youtube_integration_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youtube_integration" ADD CONSTRAINT "youtube_integration_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
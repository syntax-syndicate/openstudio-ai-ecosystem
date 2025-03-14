CREATE TYPE "public"."action_type" AS ENUM('REPLY', 'DELETE', 'PUBLISH', 'REJECT', 'REVIEW', 'MARK_AS_SPAM', 'NOTIFY', 'CALL_WEBHOOK', 'CATEGORIZE', 'TRANSLATE');--> statement-breakpoint
CREATE TYPE "public"."executed_rule_status" AS ENUM('APPLIED', 'APPLYING', 'REJECTED', 'PENDING', 'SKIPPED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."logical_operator" AS ENUM('AND', 'OR');--> statement-breakpoint
CREATE TYPE "public"."youtube_comment_data_sync_frequency" AS ENUM('manual', 'hourly', '6hours', '12hours', 'daily', 'weekly', 'monthly', 'quaterly', 'half_yearly', 'yearly');--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(256),
	"rules_prompt" text,
	"ai_provider" text,
	"ai_model" text,
	"ai_api_key" text
);
--> statement-breakpoint
CREATE TABLE "action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"type" "action_type" NOT NULL,
	"rule_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "executed_action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"executed_rule_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "executed_rule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"comment_id" text NOT NULL,
	"video_id" text NOT NULL,
	"status" "executed_rule_status" NOT NULL,
	"automated" boolean NOT NULL,
	"reason" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"automate" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"conditional_operator" "logical_operator" DEFAULT 'AND' NOT NULL,
	"instructions" text
);
--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "youtube_channel_id" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "youtube_comment_data_sync_frequency" "youtube_comment_data_sync_frequency" DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_rule_id_rule_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."rule"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executed_action" ADD CONSTRAINT "executed_action_executed_rule_id_executed_rule_id_fk" FOREIGN KEY ("executed_rule_id") REFERENCES "public"."executed_rule"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executed_rule" ADD CONSTRAINT "executed_rule_rule_id_rule_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."rule"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executed_rule" ADD CONSTRAINT "executed_rule_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rule" ADD CONSTRAINT "rule_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "executed_rule_user_id_comment_id_video_id_idx" ON "executed_rule" USING btree ("user_id","comment_id","video_id");--> statement-breakpoint
CREATE INDEX "executed_rule_user_id_status_created_at_idx" ON "executed_rule" USING btree ("user_id","status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "rule_user_id_name_idx" ON "rule" USING btree ("user_id","name");
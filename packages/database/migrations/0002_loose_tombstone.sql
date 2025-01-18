CREATE TYPE "public"."feedback_type" AS ENUM('positive', 'neutral', 'negative');--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feedback" text NOT NULL,
	"feedback_type" "feedback_type" NOT NULL,
	"email" varchar(320),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "custom_assistants" (
	"name" text NOT NULL,
	"description" text,
	"system_prompt" text NOT NULL,
	"icon_url" text,
	"key" text PRIMARY KEY NOT NULL,
	"start_message" json,
	CONSTRAINT "custom_assistants_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "custom_assistant" json;
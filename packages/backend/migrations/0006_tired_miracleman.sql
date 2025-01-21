CREATE TYPE "public"."assistant_type" AS ENUM('base', 'custom');--> statement-breakpoint
CREATE TYPE "public"."dalle_image_quality" AS ENUM('standard', 'hd');--> statement-breakpoint
CREATE TYPE "public"."dalle_image_size" AS ENUM('1024x1024', '1792x1024', '1024x1792');--> statement-breakpoint
CREATE TYPE "public"."feedback_type" AS ENUM('positive', 'neutral', 'negative');--> statement-breakpoint
CREATE TYPE "public"."provider" AS ENUM('chathub', 'openai', 'anthropic', 'gemini', 'ollama', 'groq');--> statement-breakpoint
CREATE TYPE "public"."stop_reason" AS ENUM('error', 'cancel', 'apikey', 'recursion', 'finish', 'unauthorized');--> statement-breakpoint
CREATE TYPE "public"."web_search_engine" AS ENUM('google', 'duckduckgo');--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"key" text NOT NULL,
	"organization_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assistants" (
	"name" text NOT NULL,
	"description" text,
	"system_prompt" text NOT NULL,
	"icon_url" text,
	"provider" "provider" NOT NULL,
	"base_model" text NOT NULL,
	"key" text PRIMARY KEY NOT NULL,
	"type" "assistant_type" NOT NULL,
	CONSTRAINT "assistants_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "changelogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"images" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"parent_id" text,
	"image" text,
	"raw_human" text,
	"raw_ai" text,
	"is_loading" boolean DEFAULT false,
	"stop" boolean DEFAULT false,
	"stop_reason" "stop_reason",
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"run_config" json NOT NULL,
	"tools" json,
	"related_questions" json
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"is_example" boolean DEFAULT false,
	"custom_assistant" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"organization_id" varchar NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_assistants" (
	"name" text NOT NULL,
	"description" text,
	"system_prompt" text NOT NULL,
	"icon_url" text,
	"key" text PRIMARY KEY NOT NULL,
	"start_message" json,
	"organization_id" varchar NOT NULL,
	CONSTRAINT "custom_assistants_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feedback" text NOT NULL,
	"feedback_type" "feedback_type" NOT NULL,
	"email" varchar(320),
	"organization_id" varchar NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" varchar NOT NULL,
	"default_assistant" text NOT NULL,
	"system_prompt" text NOT NULL,
	"message_limit" integer NOT NULL,
	"temperature" numeric NOT NULL,
	"memories" json NOT NULL,
	"suggest_related_questions" boolean NOT NULL,
	"generate_title" boolean NOT NULL,
	"default_plugins" json NOT NULL,
	"whisper_speech_to_text_enabled" boolean NOT NULL,
	"dalle_image_quality" "dalle_image_quality" NOT NULL,
	"dalle_image_size" "dalle_image_size" NOT NULL,
	"max_tokens" integer NOT NULL,
	"default_web_search_engine" "web_search_engine" NOT NULL,
	"ollama_base_url" text NOT NULL,
	"top_p" numeric NOT NULL,
	"top_k" numeric NOT NULL,
	"google_search_engine_id" text,
	"google_search_api_key" text,
	CONSTRAINT "preferences_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT 'e20243e1-0128-42d1-ab79-e3336dd29950';--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_assistants" ADD CONSTRAINT "custom_assistants_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preferences" ADD CONSTRAINT "preferences_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
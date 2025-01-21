DROP INDEX "chat_sessions_organization_id_idx";--> statement-breakpoint
DROP INDEX "chat_sessions_user_id_idx";--> statement-breakpoint
DROP INDEX "prompts_organization_id_idx";--> statement-breakpoint
DROP INDEX "prompts_user_id_idx";--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT 'd001ece3-a0ec-4bd1-8f1b-0c73aee15142';
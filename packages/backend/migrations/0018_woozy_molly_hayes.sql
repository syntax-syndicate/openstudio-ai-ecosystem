ALTER TABLE "integration_state" ALTER COLUMN "organization_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "integration_state" ALTER COLUMN "creator_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "youtube_integration" ALTER COLUMN "organization_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "youtube_integration" ALTER COLUMN "creator_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "youtube_integration" ALTER COLUMN "access_token" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "youtube_integration" ALTER COLUMN "refresh_token" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "youtube_integration" ALTER COLUMN "token_type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "youtube_integration" ALTER COLUMN "scope" SET DATA TYPE varchar;
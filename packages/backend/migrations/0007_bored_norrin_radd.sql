ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT '7720bee4-a29d-42d6-af30-0f7956d394b0';--> statement-breakpoint
CREATE INDEX "chat_sessions_organization_id_idx" ON "chat_sessions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "chat_sessions_user_id_idx" ON "chat_sessions" USING btree ("user_id");
ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT '4315e7de-2e6d-4040-a278-94e4e9af0841';--> statement-breakpoint
CREATE INDEX "chat_sessions_organization_id_idx" ON "chat_sessions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "chat_sessions_user_id_idx" ON "chat_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "prompts_organization_id_idx" ON "prompts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "prompts_user_id_idx" ON "prompts" USING btree ("user_id");
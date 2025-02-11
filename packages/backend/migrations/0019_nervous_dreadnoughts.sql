ALTER TABLE "integration_state" DROP CONSTRAINT "integration_state_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "integration_state" DROP CONSTRAINT "integration_state_creator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "youtube_integration" DROP CONSTRAINT "youtube_integration_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "youtube_integration" DROP CONSTRAINT "youtube_integration_creator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "integration_state" ADD CONSTRAINT "integration_state_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_state" ADD CONSTRAINT "integration_state_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youtube_integration" ADD CONSTRAINT "youtube_integration_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youtube_integration" ADD CONSTRAINT "youtube_integration_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
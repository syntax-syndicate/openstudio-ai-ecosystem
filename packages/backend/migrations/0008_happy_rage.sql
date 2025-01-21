ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT '742657df-0f18-4183-b58d-196700897533';--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "organization_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prompts_organization_id_idx" ON "prompts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "prompts_user_id_idx" ON "prompts" USING btree ("user_id");
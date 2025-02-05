CREATE TABLE "premium" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"organizationId" uuid,
	"tier" "premium_tier" NOT NULL,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (6) DEFAULT now() NOT NULL,
	"lemon_squeezy_renews_at" timestamp (6),
	"lemon_squeezy_customer_id" integer,
	"lemon_squeezy_subscription_id" integer,
	"lemon_squeezy_subscription_item_id" integer,
	"lemon_squeezy_order_id" integer,
	"lemon_squeezy_product_id" integer,
	"lemon_squeezy_variant_id" integer
);
--> statement-breakpoint
ALTER TABLE "premium" ADD CONSTRAINT "premium_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "premium" ADD CONSTRAINT "premium_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "premium_organization_id_idx" ON "premium" USING btree ("organizationId");
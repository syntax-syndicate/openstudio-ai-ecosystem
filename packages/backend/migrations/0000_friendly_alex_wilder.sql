CREATE TABLE "organization" (
	"id" varchar(191) PRIMARY KEY DEFAULT cuid() NOT NULL,
	"name" varchar(191) NOT NULL,
	"logoUrl" varchar(191),
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (6) DEFAULT now() NOT NULL,
	"productDescription" text
);

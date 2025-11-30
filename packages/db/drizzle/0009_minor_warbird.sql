ALTER TABLE "analytics_snapshots" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics_snapshots" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "media_kits" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "deleted_at" timestamp;
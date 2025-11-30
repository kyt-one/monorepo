ALTER TABLE "analytics_snapshots" ALTER COLUMN "history" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "analytics_snapshots" ALTER COLUMN "history" SET NOT NULL;
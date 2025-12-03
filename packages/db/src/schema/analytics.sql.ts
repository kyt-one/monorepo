import { sql } from "drizzle-orm";
import { jsonb, pgPolicy, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../schema.helpers";
import { Profiles } from "./account.sql";
import { connectedAccountProvider } from "./enums.sql";

export type AnalyticsProvider = Record<
  string,
  { stats: PlatformStats; history: PlatformHistoryItem[] }
>;

export interface YouTubeStats {
  subscribers: number;
  views: number;
  videos: number;
}

export interface YouTubeHistoryItem {
  date: string;
  views: number;
  watchTimeMinutes: number;
  subscribersGained: number;
  likes: number;
}

export type PlatformStats = YouTubeStats;

export type PlatformHistoryItem = YouTubeHistoryItem;

export const AnalyticsSnapshots = pgTable(
  "analytics_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Profiles.id, { onDelete: "cascade" }),
    provider: connectedAccountProvider("provider").notNull(),
    platformId: text("platform_id").notNull(),
    stats: jsonb("stats").$type<PlatformStats>().notNull(),
    history: jsonb("history").$type<PlatformHistoryItem[]>().notNull().default([]),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Users can view own snapshots", {
      for: "select",
      using: sql`auth.uid() = ${table.userId}`,
    }),
  ]
);

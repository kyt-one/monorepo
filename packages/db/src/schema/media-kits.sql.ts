import { sql } from "drizzle-orm";
import { boolean, jsonb, pgPolicy, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { DefaultKitTheme, timestamps } from "../schema.helpers";
import { Profiles } from "./account.sql";
import type { connectedAccountProvider, metricType } from "./enums.sql";

export interface ProfileBlockData {
  displayName?: string;
}

export interface StatsBlockData {
  provider: (typeof connectedAccountProvider.enumValues)[number];
  metric: (typeof metricType.enumValues)[number];
}

export interface ChartBlockData {
  provider: (typeof connectedAccountProvider.enumValues)[number];
  metric: (typeof metricType.enumValues)[number];
  days: number;
}

export interface SeparatorBlockData {
  title: string;
}

export interface ContactBlockData {
  buttonText: string;
}

export interface CustomBlockData {
  title?: string;
  description?: string;
  textColor?: string;
  link?: string;
  backgroundColor?: string;
  backgroundImage?: string;
}

export interface MediaKitTheme {
  primary: string;
  radius: number;
}

export type KitBlock =
  | { id: string; type: "profile"; data: ProfileBlockData }
  | { id: string; type: "stats"; data: StatsBlockData }
  | { id: string; type: "chart"; data: ChartBlockData }
  | { id: string; type: "separator"; data: SeparatorBlockData }
  | { id: string; type: "custom"; data: CustomBlockData }
  | { id: string; type: "contact"; data: ContactBlockData };

export type BlockType = KitBlock["type"];

export const MediaKits = pgTable(
  "media_kits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Profiles.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    published: boolean("published").default(false).notNull(),
    default: boolean("default").default(false).notNull(),
    theme: jsonb("theme").$type<MediaKitTheme>().notNull().default(DefaultKitTheme),
    blocks: jsonb("blocks").$type<KitBlock[]>().notNull(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Public can view published kits", {
      for: "select",
      using: sql`${table.published} = true`,
    }),
    pgPolicy("Users can view own kits", {
      for: "select",
      using: sql`auth.uid() = ${table.userId}`,
    }),
    pgPolicy("Users can create own kits", {
      for: "insert",
      withCheck: sql`auth.uid() = ${table.userId}`,
    }),
    pgPolicy("Users can update own kits", {
      for: "update",
      using: sql`auth.uid() = ${table.userId}`,
    }),
    pgPolicy("Users can delete own kits", {
      for: "delete",
      using: sql`auth.uid() = ${table.userId}`,
    }),
  ]
);

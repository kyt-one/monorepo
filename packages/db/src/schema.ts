import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgEnum,
  pgPolicy,
  pgSchema,
  pgTable,
  pgView,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helpers";

// --- Enums ---
export const onboardingSteps = pgEnum("onboarding_steps", ["username", "stats", "welcome"]);
export const subscriptionTier = pgEnum("subscription_tier", ["free", "pro"]);
export const connectedAccountProvider = pgEnum("connected_account_provider", ["youtube"]);

// --- JSON Types ---
export interface MediaKitTheme {
  primary: string;
  radius: number;
}

export interface AnalyticsStats {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface AnalyticsHistoryItem {
  date: string;
  views: number;
  watchTimeMinutes: number;
}

// --- Tables ---

const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    username: text("username").unique(),
    tier: subscriptionTier("tier").default("free").notNull(),
    onboardingSteps: onboardingSteps("onboarding_steps").array().default([]).notNull(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Users can view own profile", {
      for: "select",
      using: sql`auth.uid() = ${table.id}`,
    }),
    pgPolicy("Users can update own profile", {
      for: "update",
      using: sql`auth.uid() = ${table.id}`,
    }),
    pgPolicy("Users can insert own profile", {
      for: "insert",
      withCheck: sql`auth.uid() = ${table.id}`,
    }),
  ]
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" })
      .unique(),
    provider: text("provider").notNull(),
    customerId: text("customer_id").unique(),
    subscriptionId: text("subscription_id").unique(),
    priceId: text("price_id"),
    currentPeriodEnd: timestamp("current_period_end"),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Users can view own subscription", {
      for: "select",
      using: sql`auth.uid() = ${table.userId}`,
    }),
  ]
);

export const mediaKits = pgTable(
  "media_kits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    published: boolean("published").default(false).notNull(),
    default: boolean("default").default(false).notNull(),
    theme: jsonb("theme").$type<MediaKitTheme>(),
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

export const connectedAccounts = pgTable(
  "connected_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    provider: connectedAccountProvider("provider").notNull(),
    accountId: text("account_id").notNull(),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at"),
    scope: text("scope"),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Users can view own connected accounts", {
      for: "select",
      using: sql`auth.uid() = ${table.userId}`,
    }),
    pgPolicy("Users can update own connected accounts", {
      for: "update",
      using: sql`auth.uid() = ${table.userId}`,
    }),
    pgPolicy("Users can insert own connected accounts", {
      for: "insert",
      withCheck: sql`auth.uid() = ${table.userId}`,
    }),
  ]
);

export const analyticsSnapshots = pgTable(
  "analytics_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    platformId: text("platform_id").notNull(),
    stats: jsonb("stats").$type<AnalyticsStats>(),
    history: jsonb("history").$type<AnalyticsHistoryItem[]>(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Users can view own snapshots", {
      for: "select",
      using: sql`auth.uid() = ${table.userId}`,
    }),
  ]
);

// --- Views ---

export const accountsDueForUpdate = pgView("accounts_due_for_update", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  provider: connectedAccountProvider("provider").notNull(),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  updatedAt: timestamp("updated_at"),
})
  .with({ securityInvoker: true })
  .as(sql`
  SELECT 
    ${connectedAccounts.id},
    ${connectedAccounts.userId},
    ${connectedAccounts.provider},
    ${connectedAccounts.accountId},
    ${connectedAccounts.accessToken},
    ${connectedAccounts.refreshToken},
    ${connectedAccounts.expiresAt},
    ${connectedAccounts.updatedAt}
  FROM ${connectedAccounts}
  JOIN ${profiles} ON ${connectedAccounts.userId} = ${profiles.id}
  WHERE 
    -- Pro Users: Update if older than 1 hour or never updated
    (
      ${profiles.tier} = 'pro' 
      AND (
        ${connectedAccounts.updatedAt} < NOW() - INTERVAL '1 hour' 
        OR ${connectedAccounts.updatedAt} IS NULL
      )
    )
    OR
    -- Free Users: Update if older than 24 hours or never updated
    (
      ${profiles.tier} = 'free' 
      AND (
        ${connectedAccounts.updatedAt} < NOW() - INTERVAL '24 hours' 
        OR ${connectedAccounts.updatedAt} IS NULL
      )
    )
`);

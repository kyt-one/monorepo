import { relations, sql } from "drizzle-orm";
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
import { DefaultAnalyticsStats, DefaultKitTheme, timestamps } from "./schema.helpers";

// --- Enums ---
export const onboardingSteps = pgEnum("onboarding_steps", ["username", "stats", "welcome"]);
export const subscriptionTier = pgEnum("subscription_tier", ["free", "pro"]);
export const connectedAccountProvider = pgEnum("connected_account_provider", [
  "youtube",
  "instagram",
  "tiktok",
]);
export const metricType = pgEnum("metric_type", ["views", "subscribers", "watchTime", "all"]);

// --- JSON Types ---
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

export interface AnalyticsStats {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  followerCount: number;
  mediaCount: number;
}

export interface AnalyticsHistoryItem {
  date: string;
  [key: string]: number | string;
}

export type KitBlock =
  | { id: string; type: "profile"; data: ProfileBlockData }
  | { id: string; type: "stats"; data: StatsBlockData }
  | { id: string; type: "chart"; data: ChartBlockData }
  | { id: string; type: "separator"; data: SeparatorBlockData }
  | { id: string; type: "custom"; data: CustomBlockData }
  | { id: string; type: "contact"; data: ContactBlockData };

export type BlockType = KitBlock["type"];

// --- Tables ---

const AuthSchema = pgSchema("auth");
const AuthUsers = AuthSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const Profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => AuthUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    username: text("username").unique().notNull().default(""),
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

export const Subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Profiles.id, { onDelete: "cascade" })
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

export const ConnectedAccounts = pgTable(
  "connected_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Profiles.id, { onDelete: "cascade" }),
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

export const AnalyticsSnapshots = pgTable(
  "analytics_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Profiles.id, { onDelete: "cascade" }),
    provider: connectedAccountProvider("provider").notNull(),
    platformId: text("platform_id").notNull(),
    stats: jsonb("stats").$type<AnalyticsStats>().notNull().default(DefaultAnalyticsStats),
    history: jsonb("history").$type<AnalyticsHistoryItem[]>().notNull().default([]),
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

export const AccountsDueForUpdate = pgView("accounts_due_for_update", {
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
    ${ConnectedAccounts.id},
    ${ConnectedAccounts.userId},
    ${ConnectedAccounts.provider},
    ${ConnectedAccounts.accountId},
    ${ConnectedAccounts.accessToken},
    ${ConnectedAccounts.refreshToken},
    ${ConnectedAccounts.expiresAt},
    ${ConnectedAccounts.updatedAt}
  FROM ${ConnectedAccounts}
  JOIN ${Profiles} ON ${ConnectedAccounts.userId} = ${Profiles.id}
  WHERE 
    -- Pro Users: Update if older than 1 hour or never updated
    (
      ${Profiles.tier} = 'pro' 
      AND (
        ${ConnectedAccounts.updatedAt} < NOW() - INTERVAL '1 hour' 
        OR ${ConnectedAccounts.updatedAt} IS NULL
      )
    )
    OR
    -- Free Users: Update if older than 24 hours or never updated
    (
      ${Profiles.tier} = 'free' 
      AND (
        ${ConnectedAccounts.updatedAt} < NOW() - INTERVAL '24 hours' 
        OR ${ConnectedAccounts.updatedAt} IS NULL
      )
    )
`);

// --- Relations ---

export const ProfilesRelations = relations(Profiles, ({ one, many }) => ({
  mediaKits: many(MediaKits),
  connectedAccounts: many(ConnectedAccounts),
  analyticsSnapshots: many(AnalyticsSnapshots),
  subscription: one(Subscriptions),
}));

export const MediaKitsRelations = relations(MediaKits, ({ one }) => ({
  profile: one(Profiles, {
    fields: [MediaKits.userId],
    references: [Profiles.id],
  }),
}));

export const SubscriptionsRelations = relations(Subscriptions, ({ one }) => ({
  profile: one(Profiles, {
    fields: [Subscriptions.userId],
    references: [Profiles.id],
  }),
}));

export const ConnectedAccountsRelations = relations(ConnectedAccounts, ({ one }) => ({
  profile: one(Profiles, {
    fields: [ConnectedAccounts.userId],
    references: [Profiles.id],
  }),
}));

export const AnalyticsSnapshotsRelations = relations(AnalyticsSnapshots, ({ one }) => ({
  profile: one(Profiles, {
    fields: [AnalyticsSnapshots.userId],
    references: [Profiles.id],
  }),
}));

import { type InferSelectModel, sql } from "drizzle-orm";
import { pgPolicy, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../schema.helpers";
import { connectedAccountProvider, onboardingSteps, subscriptionTier } from "./enums.sql";

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

export type Profile = InferSelectModel<typeof Profiles>;

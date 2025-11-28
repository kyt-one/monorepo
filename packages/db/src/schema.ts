import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgPolicy,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

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
    tier: text("tier", { enum: ["free", "pro"] })
      .default("free")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
    theme: jsonb("theme").$type<{
      primary?: string;
      radius?: number;
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

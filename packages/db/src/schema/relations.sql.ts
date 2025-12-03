import { relations } from "drizzle-orm";
import { ConnectedAccounts, Profiles } from "./account.sql";
import { AnalyticsSnapshots } from "./analytics.sql";
import { MediaKits } from "./media-kits.sql";
import { Subscriptions } from "./subscriptions.sql";

export const AnalyticsSnapshotsRelations = relations(AnalyticsSnapshots, ({ one }) => ({
  profile: one(Profiles, {
    fields: [AnalyticsSnapshots.userId],
    references: [Profiles.id],
  }),
}));

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

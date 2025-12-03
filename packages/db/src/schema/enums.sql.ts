import { pgEnum } from "drizzle-orm/pg-core";

export const metricType = pgEnum("metric_type", ["views", "subscribers", "watchTime", "all"]);

export const onboardingSteps = pgEnum("onboarding_steps", ["username", "stats", "welcome"]);

export const subscriptionTier = pgEnum("subscription_tier", ["free", "pro"]);

export const connectedAccountProvider = pgEnum("connected_account_provider", [
  "youtube",
  "instagram",
  "tiktok",
]);

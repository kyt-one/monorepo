"use server";

import {
  type AnalyticsProvider,
  AnalyticsSnapshots,
  db,
  type MediaKitEventType,
  MediaKits,
  Profiles,
} from "@repo/db";
import { MediaKitAnalyticsService, YouTubeService } from "@repo/utils/server";
import { differenceInMinutes } from "date-fns";
import { and, desc, eq } from "drizzle-orm";
import { after } from "next/server";
import { Now } from "../../../../packages/utils/src/current-date";

export async function getCreatorEmailAction(profileId: string) {
  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.id, profileId),
    columns: {
      email: true,
    },
  });

  if (!profile) return { error: "Email not found" };

  return { email: profile.email };
}

export async function getPublishedKitAction(username: string, slug?: string) {
  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.username, username),
    columns: { id: true },
  });

  if (!profile) return null;

  const kit = await db.query.MediaKits.findFirst({
    where: and(
      eq(MediaKits.userId, profile.id),
      eq(MediaKits.published, true),
      slug ? eq(MediaKits.slug, slug) : eq(MediaKits.default, true)
    ),
    with: {
      profile: {
        with: {
          subscription: true,
          connectedAccounts: true,
        },
      },
    },
  });

  if (!kit) return null;

  const latestSnapshots = await db
    .selectDistinctOn([AnalyticsSnapshots.provider])
    .from(AnalyticsSnapshots)
    .where(eq(AnalyticsSnapshots.userId, kit.profile.id))
    .orderBy(AnalyticsSnapshots.provider, desc(AnalyticsSnapshots.createdAt));

  const analyticsProvider: AnalyticsProvider = {};

  for (const snap of latestSnapshots) {
    analyticsProvider[snap.provider] = {
      stats: snap.stats,
      history: snap.history,
    };

    switch (snap.provider) {
      case "youtube": {
        const lastUpdate = snap.updatedAt;
        const diffMins = differenceInMinutes(Now(), lastUpdate);

        const tier = kit.profile.tier;
        const interval = kit.profile.subscription?.interval;

        console.log(`[YouTube Stale Check] User: ${kit.profile.username}, Diff: ${diffMins}m, Tier: ${tier}, Interval: ${interval}`);

        let isStale = false;

        // Rule: Annual Pro = 15 mins
        if (tier === "pro" && interval === "year" && diffMins > 15) isStale = true;
        // Rule: Monthly Pro = 60 mins
        else if (tier === "pro" && diffMins > 60) isStale = true;
        // Rule: Free = 24 hours (1440 mins)
        else if (tier === "free" && diffMins > 1440) isStale = true;

        console.log(`[YouTube Stale Check] isStale: ${isStale}`);

        if (isStale) {
          const account = kit.profile.connectedAccounts.find((a) => a.provider === "youtube");

          if (account) {
            console.log("[YouTube Stale Check] Refreshing stats in background...");
            after(async () => {
              await YouTubeService.fetchAndSaveStats(
                kit.profile.id,
                account.accessToken,
                account.refreshToken
              );
              console.log("[YouTube Stale Check] Stats refresh completed.");
            });
          } else {
            console.log("[YouTube Stale Check] No connected YouTube account found.");
          }
        }
      }
    }
  }

  const { profile: fullProfile, ...kitData } = kit;

  return {
    kit: kitData,
    profile: fullProfile,
    analyticsProvider,
  };
}

export async function trackInteractionAction(
  kitId: string,
  type: MediaKitEventType,
  meta?: Record<string, unknown>
) {
  MediaKitAnalyticsService.trackEvent(kitId, type, meta);
}

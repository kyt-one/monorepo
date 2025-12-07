"use server";

import { type AnalyticsProvider, AnalyticsSnapshots, db, MediaKits, Profiles } from "@repo/db";
import { differenceInMinutes } from "date-fns";
import { and, desc, eq } from "drizzle-orm";
import { after } from "next/server";
import { fetchAndSaveYouTubeStats } from "@/lib/services/youtube";

export async function getCreatorEmail(profileId: string) {
  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.id, profileId),
    columns: {
      email: true,
    },
  });

  if (!profile) return { error: "Email not found" };

  return { email: profile.email };
}

export async function getPublishedMediaKit(slug: string) {
  const kitData = await db.query.MediaKits.findFirst({
    where: and(eq(MediaKits.slug, slug), eq(MediaKits.published, true)),
    with: {
      profile: {
        with: {
          subscription: true,
          connectedAccounts: true,
        },
      },
    },
  });

  if (!kitData) return null;

  const latestSnapshots = await db
    .selectDistinctOn([AnalyticsSnapshots.provider])
    .from(AnalyticsSnapshots)
    .where(eq(AnalyticsSnapshots.userId, kitData.profile.id))
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
        const now = new Date();
        const diffMins = differenceInMinutes(now, lastUpdate);

        const tier = kitData.profile.tier;
        const interval = kitData.profile.subscription?.interval;

        let isStale = false;

        // Rule: Annual Pro = 15 mins
        if (tier === "pro" && interval === "year" && diffMins > 15) isStale = true;
        // Rule: Monthly Pro = 60 mins
        else if (tier === "pro" && diffMins > 60) isStale = true;
        // Rule: Free = 24 hours (1440 mins)
        else if (tier === "free" && diffMins > 1440) isStale = true;

        if (isStale) {
          const account = kitData.profile.connectedAccounts.find((a) => a.provider === "youtube");

          if (account) {
            after(async () => {
              await fetchAndSaveYouTubeStats(
                kitData.profile.id,
                account.accessToken,
                account.refreshToken
              );
            });
          }
        }
      }
    }
  }

  const { profile, ...kit } = kitData;

  return {
    kit,
    profile,
    analyticsProvider,
  };
}

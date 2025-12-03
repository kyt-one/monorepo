"use server";

import { AnalyticsSnapshots, db, MediaKits, Profiles } from "@repo/db";
import type { AnalyticsProviders } from "@repo/db/src/schema.helpers";
import { and, desc, eq } from "drizzle-orm";

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
      profile: true,
    },
  });

  if (!kitData) return null;

  const latestSnapshots = await db
    .selectDistinctOn([AnalyticsSnapshots.provider])
    .from(AnalyticsSnapshots)
    .where(eq(AnalyticsSnapshots.userId, kitData.profile.id))
    .orderBy(AnalyticsSnapshots.provider, desc(AnalyticsSnapshots.createdAt));

  const analyticsProviders: AnalyticsProviders = {};

  for (const snap of latestSnapshots) {
    analyticsProviders[snap.provider] = {
      stats: snap.stats,
      history: snap.history,
    };
  }

  const { profile, ...kit } = kitData;

  return {
    kit,
    profile,
    analyticsProviders,
  };
}

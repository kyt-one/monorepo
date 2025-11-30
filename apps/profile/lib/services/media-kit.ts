import { analyticsSnapshots, db, mediaKits } from "@repo/db";
import { and, desc, eq } from "drizzle-orm";

export async function getPublishedMediaKit(slug: string) {
  const kitData = await db.query.mediaKits.findFirst({
    where: and(eq(mediaKits.slug, slug), eq(mediaKits.published, true)),
    with: {
      profile: true,
    },
  });

  if (!kitData) return null;

  const snapshot = await db.query.analyticsSnapshots.findFirst({
    where: eq(analyticsSnapshots.userId, kitData.profile.id),
    orderBy: [desc(analyticsSnapshots.createdAt)],
  });
  if (!snapshot) return null;

  const { profile, ...kit } = kitData;

  return {
    kit,
    profile,
    snapshot,
  };
}

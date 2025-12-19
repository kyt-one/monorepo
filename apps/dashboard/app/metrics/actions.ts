"use server";

import { db, MediaKits, Profiles } from "@repo/db";
import { MediaKitAnalyticsService } from "@repo/utils/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

export async function getMetricsDataAction(kitId: string) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const kit = await db.query.MediaKits.findFirst({
    where: eq(MediaKits.id, kitId),
  });

  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.id, user.id),
  });

  if (!kit || !profile) redirect("/");
  if (kit.userId !== user.id) redirect("/");

  const [totals, history] = await Promise.all([
    MediaKitAnalyticsService.getMetrics(kit.id),
    MediaKitAnalyticsService.getGrowthChart(kit.id, 30),
  ]);

  return { kit, profile, totals, history };
}

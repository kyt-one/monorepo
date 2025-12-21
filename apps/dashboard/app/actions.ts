"use server";

import { ConnectedAccounts, db, MediaKits, Profiles } from "@repo/db";
import { MediaKitAnalyticsService } from "@repo/utils/server";
import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

export async function getDashboardDataAction() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.id, user.id),
  });

  const kits = await db.query.MediaKits.findMany({
    where: eq(MediaKits.userId, user.id),
    orderBy: desc(MediaKits.createdAt),
  });

  if (!profile || kits.length === 0) redirect("/auth/sign-in");

  const ytAccount = await db.query.ConnectedAccounts.findFirst({
    where: and(eq(ConnectedAccounts.userId, user.id), eq(ConnectedAccounts.provider, "youtube")),
    columns: {
      id: true,
      status: true,
    },
  });

  const kitsWithMetrics = await Promise.all(
    kits.map(async (kit) => {
      const stats = await MediaKitAnalyticsService.getMetrics(kit.id);
      return { ...kit, stats };
    })
  );

  return { user, profile, kits: kitsWithMetrics, ytAccount };
}

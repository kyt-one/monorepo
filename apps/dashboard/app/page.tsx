import { analyticsSnapshots, db, mediaKits, profiles } from "@repo/db";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { shortNumber } from "@repo/utils";
import { and, desc, eq } from "drizzle-orm";
import { BarChart3, Edit, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CopyMediaKitLink } from "@/components/copy-media-kit-link";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";
import { signOut } from "./auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const [profile, kit, snapshot] = await Promise.all([
    db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    }),
    db.query.mediaKits.findFirst({
      where: and(eq(mediaKits.userId, user.id), eq(mediaKits.default, true)),
    }),
    db.query.analyticsSnapshots.findFirst({
      where: eq(analyticsSnapshots.userId, user.id),
      orderBy: [desc(analyticsSnapshots.createdAt)],
    }),
  ]);

  if (!profile || !kit || !snapshot) redirect("/auth/sign-in");

  const kitUrl = `https://kyt.one/${kit.slug}`;
  const stats = snapshot.stats;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your media kit and analytics.</p>
        </div>
        <div className="flex gap-2">
          <form action={signOut}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <CopyMediaKitLink url={kitUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Update your kit's appearance and primary color.
              </p>
              <div className="flex gap-2">
                <Button className="w-full" asChild>
                  <Link href="/editor">
                    <Edit className="mr-2 size-4" /> Open Editor
                  </Link>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <Settings className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="size-5" /> Current Snapshot
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <StatsCard label="Subscribers" value={shortNumber(stats.subscriberCount)} />
            <StatsCard label="Total Views" value={shortNumber(stats.viewCount)} />
            <StatsCard label="Videos" value={shortNumber(stats.videoCount)} />
          </div>
        </div>
      </div>
    </main>
  );
}

function StatsCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

import { db, MediaKits, Profiles } from "@repo/db";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { and, eq } from "drizzle-orm";
import { Edit, Settings } from "lucide-react";
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

  const [profile, kit] = await Promise.all([
    db.query.Profiles.findFirst({
      where: eq(Profiles.id, user.id),
    }),
    db.query.MediaKits.findFirst({
      where: and(eq(MediaKits.userId, user.id), eq(MediaKits.default, true)),
    }),
  ]);

  if (!profile || !kit) redirect("/auth/sign-in");

  const kitUrl = `https://kyt.one/${kit.slug}`;

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
      </div>
    </main>
  );
}

function _StatsCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

import { CheckoutTiersConfig, db, MediaKits, Profiles } from "@repo/db";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { getKitUrl } from "@repo/utils";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CopyMediaKitLink } from "@/components/copy-media-kit-link";
import { UpgradeButton } from "@/components/upgrade-button";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

export default async function DashboardPage() {
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

  const isPro = profile.tier === "pro";

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your {kits.length} media kit{kits.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {!isPro && (
            <div className="flex gap-2">
              <UpgradeButton
                interval="month"
                tier="pro"
                userId={user.id}
                buttonText={`Monthly ${CheckoutTiersConfig.pro.month.price}`}
                {...CheckoutTiersConfig.pro.month}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              />
              <UpgradeButton
                interval="year"
                tier="pro"
                userId={user.id}
                buttonText={`Yearly ${CheckoutTiersConfig.pro.year.price}`}
                {...CheckoutTiersConfig.pro.year}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {kits.map((kit) => (
          <Card key={kit.id} className={kit.default ? "border-primary/20 bg-muted/10" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between items-center">
                {kit.default && (
                  <span className="text-xs font-normal px-2 py-1 bg-primary/10 rounded-full">
                    Default
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CopyMediaKitLink url={getKitUrl(kit.slug)} />
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/editor?kitId=${kit.id}`}>Edit Kit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

import { CheckoutTiersConfig } from "@repo/db";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { getKitUrl } from "@repo/utils";
import { Eye, MousePointerClick, Share2 } from "lucide-react";
import Link from "next/link";
import { When } from "react-if";
import { CopyMediaKitLink } from "@/components/copy-media-kit-link";
import { CreateKitButton } from "@/components/create-kit-button";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { UpgradeButton } from "@/components/upgrade-button";
import { getDashboardDataAction } from "./actions";

export default async function DashboardPage() {
  const data = await getDashboardDataAction();
  const { user, profile, kits } = data;

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
          <When condition={!isPro}>
            <div className="flex gap-2">
              <UpgradeButton
                interval="month"
                tier="pro"
                userId={user.id}
                buttonText={`Monthly $${CheckoutTiersConfig.pro.month.price}`}
                {...CheckoutTiersConfig.pro.month}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              />
              <UpgradeButton
                interval="year"
                tier="pro"
                userId={user.id}
                buttonText={`Yearly $${CheckoutTiersConfig.pro.year.price}`}
                {...CheckoutTiersConfig.pro.year}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              />
            </div>
          </When>
          <When condition={isPro}>
            <ManageSubscriptionButton />
          </When>
          <CreateKitButton profile={profile} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {kits.map((kit) => (
          <Card key={kit.id} className={kit.default ? "border-primary/20 bg-muted/10" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{getKitUrl({ kit, profile, includeBase: false })}</span>
                {kit.default && (
                  <span className="text-xs font-normal px-2 py-1 bg-primary/10 rounded-full text-primary">
                    Default
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md border text-center">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                    <Eye className="w-3 h-3" /> Views
                  </div>
                  <span className="font-bold text-lg">{kit.stats.views}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md border text-center">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                    <Share2 className="w-3 h-3" /> Shares
                  </div>
                  <span className="font-bold text-lg">{kit.stats.shares}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md border text-center">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                    <MousePointerClick className="w-3 h-3" /> Clicks
                  </div>
                  <span className="font-bold text-lg">{kit.stats.contacts}</span>
                </div>
              </div>

              <div className="space-y-2">
                <CopyMediaKitLink url={getKitUrl({ kit, profile })} />
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/editor?kitId=${kit.id}`}>Edit Kit</Link>
                  </Button>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/metrics?kitId=${kit.id}`}>View Report</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

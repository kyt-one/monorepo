import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { getKitUrl } from "@repo/utils";
import { ArrowLeft, Eye, MousePointerClick, Share2 } from "lucide-react";
import Link from "next/link";
import { MetricsChart } from "@/components/metrics-chart";
import { getMetricsDataAction } from "./actions";

interface Props {
  searchParams: Promise<{ kitId: string }>;
}

export default async function MetricsPage({ searchParams }: Props) {
  const params = await searchParams;
  const data = await getMetricsDataAction(params.kitId);
  const { kit, profile, totals, history } = data;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Button variant="ghost" size="sm" className="h-6 px-0 -ml-2" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Performance for <span className="font-medium text-foreground">{kit.slug}</span>
          </p>
        </div>

        <Button variant="outline" asChild>
          <a href={getKitUrl({ kit, profile })} target="_blank" rel="noreferrer">
            View Live Kit
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Views"
          value={totals.views}
          icon={<Eye />}
          description="All-time page views"
        />
        <StatsCard
          title="Total Shares"
          value={totals.shares}
          icon={<Share2 />}
          description="Native shares & copies"
        />
        <StatsCard
          title="Conversion Clicks"
          value={totals.contacts}
          icon={<MousePointerClick />}
          description="Work With Me clicks"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <MetricsChart data={history} />
      </div>
    </main>
  );
}

function StatsCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

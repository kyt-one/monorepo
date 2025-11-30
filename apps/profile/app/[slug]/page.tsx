import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { shortNumber } from "@repo/utils";
import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedMediaKit } from "@/lib/services/media-kit";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedMediaKit(slug);

  if (!data) return { title: "Not Found | Kyt" };

  return {
    title: `${data.profile.username} | Kyt`,
    description: `Check out ${data.profile.username}'s verified media kit on Kyt.`,
  };
}

export default async function MediaKitPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await getPublishedMediaKit(slug);
  if (!data) notFound();

  const { profile, snapshot } = data;
  const stats = snapshot.stats;

  return (
    <main className="min-h-screen bg-slate-50 p-10 md:p-20">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center flex-col gap-2 items-center">
          <h1 className="text-2xl font-bold">@{profile.username}</h1>
          <div className="flex items-center gap-1 text-xs text-green-800 bg-green-300 w-fit px-3 py-1 rounded-full">
            Verified
            <ShieldCheck size={12} strokeWidth={2.5} />
          </div>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{shortNumber(stats.subscriberCount)}</div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shortNumber(stats.viewCount)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shortNumber(stats.videoCount)}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="text-xs text-muted-foreground tracking-widest">Powered by Kyt</p>
        </div>
      </div>
    </main>
  );
}

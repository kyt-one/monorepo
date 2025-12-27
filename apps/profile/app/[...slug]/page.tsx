import { getDisplayUsername } from "@repo/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/block-renderer";
import { PageViewedTracker } from "@/components/page-viewed-tracker";
import { ProfileHero } from "@/components/profile-hero";
import { ShareButton } from "@/components/share-button";
import { getPublishedKitAction } from "./actions";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParams } = await params;

  const username = slugParams[0];
  const slug = slugParams[1];

  const data = await getPublishedKitAction(username, slug);
  if (!data) return { title: "Not Found | Kyt" };

  const displayName = getDisplayUsername(data.profile, data.kit.profileOverride);

  return {
    title: `${displayName} | Kyt`,
    description: `Check out ${displayName}'s verified media kit on Kyt.`,
  };
}

export default async function MediaKitPage({ params }: PageProps) {
  const { slug: slugParams } = await params;

  const username = slugParams[0];
  const slug = slugParams[1];

  const data = await getPublishedKitAction(username, slug);
  if (!data) notFound();

  const { kit, profile, analyticsProvider } = data;
  const primary = kit.theme.primary;
  const radius = kit.theme.radius;

  return (
    <>
      <PageViewedTracker kitId={kit.id} />

      <div
        className="min-h-screen"
        style={{
          ["--primary" as string]: primary,
          ["--radius" as string]: `${radius}rem`,
        }}
      >
        <ShareButton className="fixed top-4 right-4 z-50" kit={kit} profile={profile} />

        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[40%] xl:w-[35%] z-10 items-center justify-center p-12 xl:p-16">
          <div className="max-w-md">
            <ProfileHero profile={profile} kit={kit} data={kit.profileOverride} />
          </div>
        </aside>

        <main className="lg:ml-[40%] xl:ml-[35%] min-h-screen p-6 md:p-10 lg:p-12 xl:p-16">
          <div className="lg:hidden mb-10">
            <ProfileHero profile={profile} kit={kit} data={kit.profileOverride} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min content-start">
            {kit.blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                kitId={kit.id}
                block={block}
                profile={profile}
                analyticsProvider={analyticsProvider}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

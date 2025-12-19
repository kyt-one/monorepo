import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/block-renderer";
import { PageViewedTracker } from "@/components/page-viewed-tracker";
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

  const profileBlock = data.kit.blocks.find((b) => b.type === "profile");
  let displayName = data.profile.username;

  if (profileBlock && profileBlock.type === "profile" && profileBlock.data.displayName) {
    displayName = profileBlock.data.displayName;
  }

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
      <main
        className="min-h-screen bg-slate-50 p-6 md:p-20 transition-colors duration-200"
        style={{
          ["--primary" as string]: primary,
          ["--radius" as string]: `${radius}rem`,
        }}
      >
        <ShareButton className="fixed top-4 right-4" kit={kit} profile={profile} />

        <div className="mx-auto max-w-md space-y-4">
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
    </>
  );
}

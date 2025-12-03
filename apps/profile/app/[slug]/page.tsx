import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/block-renderer";
import { getPublishedMediaKit } from "./actions";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedMediaKit(slug);

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
  const { slug } = await params;

  const data = await getPublishedMediaKit(slug);
  if (!data) notFound();

  const { kit, profile, analyticsProvider } = data;
  const primary = kit.theme.primary;
  const radius = kit.theme.radius;

  return (
    <main
      className="min-h-screen bg-slate-50 p-6 md:p-20 transition-colors duration-200"
      style={{
        ["--primary" as string]: primary,
        ["--radius" as string]: `${radius}rem`,
      }}
    >
      <div className="mx-auto max-w-md space-y-4">
        {kit.blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            profile={profile}
            analyticsProvider={analyticsProvider}
          />
        ))}
      </div>
    </main>
  );
}

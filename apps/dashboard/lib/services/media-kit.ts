import { db, MediaKits, Profiles } from "@repo/db";
import { GetDefaultKitBlocks } from "@repo/db/src/schema.helpers";
import { and, eq } from "drizzle-orm";

export async function createDefaultKit(userId: string) {
  const existingDefaultKit = await db.query.MediaKits.findFirst({
    where: and(eq(MediaKits.userId, userId), eq(MediaKits.default, true)),
  });

  if (existingDefaultKit) return existingDefaultKit;

  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.id, userId),
    columns: { username: true },
  });

  if (!profile) throw new Error("User has no profile");
  if (!profile.username) throw new Error("User has no username");

  const [newKit] = await db
    .insert(MediaKits)
    .values({
      userId,
      slug: profile.username,
      published: true,
      default: true,
      blocks: GetDefaultKitBlocks(profile.username),
    })
    .returning();

  return newKit;
}

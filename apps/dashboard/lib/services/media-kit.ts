import { db, mediaKits, profiles } from "@repo/db";
import { eq } from "drizzle-orm";

export async function createDefaultKit(userId: string) {
  const existingKit = await db.query.mediaKits.findFirst({
    where: eq(mediaKits.userId, userId),
  });

  if (existingKit) {
    return existingKit;
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
    columns: { username: true },
  });

  if (!profile) throw new Error("User has no profile");

  if (!profile.username) throw new Error("User has no username");

  const [newKit] = await db
    .insert(mediaKits)
    .values({
      userId,
      slug: profile.username,
      published: true,
      theme: {
        primary: "#171717",
        radius: 0.5,
      },
    })
    .returning();

  return newKit;
}

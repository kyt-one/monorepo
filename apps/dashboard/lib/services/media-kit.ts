import { db, mediaKits, profiles } from "@repo/db";
import { and, eq } from "drizzle-orm";

export async function createDefaultKit(userId: string) {
  const existingDefaultKit = await db.query.mediaKits.findFirst({
    where: and(eq(mediaKits.userId, userId), eq(mediaKits.default, true)),
  });

  if (existingDefaultKit) return existingDefaultKit;

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
      default: true,
      theme: {
        primary: "#171717",
        radius: 0.5,
      },
    })
    .returning();

  return newKit;
}

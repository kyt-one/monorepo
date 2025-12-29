import { db, MediaKits, Profiles } from "@repo/db";
import { and, count, eq } from "drizzle-orm";
import { getDefaultBlock } from "../default-block-types";
import { takeUnique } from "../take-unique";

export const MediaKitService = {
  async createDefault(userId: string) {
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

    const newKit = takeUnique(
      await db
        .insert(MediaKits)
        .values({
          userId,
          slug: profile.username,
          published: true,
          default: true,
          blocks: [
            getDefaultBlock("separator", { title: "Stats" }),
            getDefaultBlock("stats", { provider: "youtube", metric: "all" }),
            getDefaultBlock("separator", { title: "Contact" }),
            getDefaultBlock("contact", { buttonText: "Get in touch" }),
          ],
        })
        .returning()
    );

    return newKit;
  },

  async createNew(userId: string, slug: string) {
    const profile = takeUnique(await db.select().from(Profiles).where(eq(Profiles.id, userId)));
    const kitCount = takeUnique(
      await db.select({ count: count() }).from(MediaKits).where(eq(MediaKits.userId, userId))
    );

    const isPro = profile.tier === "pro";
    const currentKits = kitCount.count;

    if (!isPro && currentKits >= 1) {
      throw new Error("Free plan is limited to 1 Media Kit. Please upgrade to Pro.");
    }

    const newKit = takeUnique(
      await db
        .insert(MediaKits)
        .values({
          userId,
          slug: slug.toLowerCase(),
          published: true,
          default: false,
          blocks: [
            getDefaultBlock("separator", { title: "Stats" }),
            getDefaultBlock("stats", { provider: "youtube", metric: "all" }),
            getDefaultBlock("separator", { title: "Contact" }),
            getDefaultBlock("contact", { buttonText: "Get in touch" }),
          ],
        })
        .returning()
    );

    return newKit;
  },
};

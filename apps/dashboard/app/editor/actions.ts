"use server";

import { db, type KitBlock, MediaKits, Profiles, type ProfileBlockData } from "@repo/db";
import { HexColorSchema } from "@repo/utils";
import { MediaKitService } from "@repo/utils/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BlockSchema, ProfileSchema } from "@/lib/schemas/editor-blocks";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";
import { Now } from "../../../../packages/utils/src/current-date";

const UpdateThemeSchema = z.object({
  kitId: z.string().uuid(),
  primary: HexColorSchema,
  radius: z.coerce.number().min(0).max(2),
});

const UpdateBlocksSchema = z.object({
  kitId: z.string().uuid(),
  blocks: z.array(BlockSchema),
});

const UpdateProfileDataSchema = z.object({
  kitId: z.string().uuid(),
  profileData: ProfileSchema,
});

export type UpdateState = {
  error?: string;
  success?: boolean;
};

export async function updateKitThemeAction(
  _prevState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    kitId: formData.get("kitId"),
    primary: formData.get("primary"),
    radius: formData.get("radius"),
  };

  const validated = UpdateThemeSchema.safeParse(rawData);
  if (!validated.success) return { error: validated.error.issues[0].message };

  const { kitId, primary, radius } = validated.data;

  try {
    await db
      .update(MediaKits)
      .set({
        theme: { primary, radius },
        updatedAt: Now(),
      })
      .where(and(eq(MediaKits.id, kitId), eq(MediaKits.userId, user.id)));

    revalidatePath("/editor");
    return { success: true };
  } catch (err) {
    return { error: `Failed to save changes: ${err}` };
  }
}

export async function updateKitBlocksAction(
  kitId: string,
  blocks: KitBlock[]
): Promise<UpdateState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) return { error: "Unauthorized" };

  const validated = UpdateBlocksSchema.safeParse({ kitId, blocks });

  if (!validated.success) {
    console.log("Validation Error:", validated.error);
    return { error: "Invalid block data" };
  }

  try {
    await db
      .update(MediaKits)
      .set({
        blocks: validated.data.blocks,
        updatedAt: Now(),
      })
      .where(and(eq(MediaKits.id, kitId), eq(MediaKits.userId, user.id)));

    revalidatePath("/editor");
    return { success: true };
  } catch (err) {
    return { error: `Failed to save changes: ${err}` };
  }
}

export async function createNewKitAction(slug: string) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) return { error: "Unauthorized" };

  try {
    await MediaKitService.createNew(user.id, slug);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create kit" };
  }
}

export async function updateKitProfileAction(
  _prevState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    kitId: formData.get("kitId"),
    profileData: {
      displayName: formData.get("displayName"),
      tagline: formData.get("tagline"),
      customAvatarUrl: formData.get("customAvatarUrl"),
    },
  };

  const validated = UpdateProfileDataSchema.safeParse(rawData);
  if (!validated.success) {
    console.log("Validation Error:", validated.error);
    return { error: validated.error.issues[0].message };
  }

  const { kitId, profileData } = validated.data;

  try {
    await db
      .update(MediaKits)
      .set({
        profileData: profileData as ProfileBlockData,
        updatedAt: Now(),
      })
      .where(and(eq(MediaKits.id, kitId), eq(MediaKits.userId, user.id)));

    revalidatePath("/editor");
    return { success: true };
  } catch (err) {
    return { error: `Failed to save changes: ${err}` };
  }
}

export async function togglePublishKitAction(kitId: string, currentState: boolean) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) throw new Error("Unauthorized");

  const newState = !currentState;

  await db
    .update(MediaKits)
    .set({ published: newState })
    .where(and(eq(MediaKits.id, kitId), eq(MediaKits.userId, user.id)));

  revalidatePath("/editor");
  revalidatePath("/dashboard");

  return newState;
}

export async function getEditorDataAction(kitId: string) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) return null;

  const [kit, profile] = await Promise.all([
    db.query.MediaKits.findFirst({
      where: and(eq(MediaKits.id, kitId), eq(MediaKits.userId, user.id)),
    }),
    db.query.Profiles.findFirst({
      where: eq(Profiles.id, user.id),
    }),
  ]);

  if (!kit || !profile) return null;

  return { kit, profile };
}

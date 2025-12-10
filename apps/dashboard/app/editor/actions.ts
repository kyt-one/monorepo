"use server";

import { db, type KitBlock, MediaKits } from "@repo/db";
import { HexColorSchema } from "@repo/utils";
import { createNewKit } from "@repo/utils/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BlockSchema } from "@/lib/schemas/editor-blocks";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

const UpdateThemeSchema = z.object({
  kitId: z.string().uuid(),
  primary: HexColorSchema,
  radius: z.coerce.number().min(0).max(2),
});

const UpdateBlocksSchema = z.object({
  kitId: z.string().uuid(),
  blocks: z.array(BlockSchema),
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
        updatedAt: new Date(),
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
        updatedAt: new Date(),
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
    await createNewKit(user.id, slug);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create kit" };
  }
}

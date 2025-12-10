import { db, MediaKits } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { BlocksEditor } from "@/components/blocks-editor";
import { EditorForm } from "@/components/editor-form";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

interface Props {
  searchParams: Promise<{ kitId: string }>;
}

export default async function EditorPage({ searchParams }: Props) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const params = await searchParams;
  const kitId = params.kitId;

  const kit = await db.query.MediaKits.findFirst({
    where: and(eq(MediaKits.id, kitId), eq(MediaKits.userId, user.id)),
  });

  if (!kit) redirect("/");

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editor</h1>
        <p className="text-muted-foreground">Manage your content blocks and appearance.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <BlocksEditor kitId={kit.id} initialBlocks={kit.blocks} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <EditorForm
            kitId={kit.id}
            initialPrimary={kit.theme.primary}
            initialRadius={kit.theme.radius}
          />
        </div>
      </div>
    </main>
  );
}

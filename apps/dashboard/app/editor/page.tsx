import { redirect } from "next/navigation";
import { BlocksEditor } from "@/components/blocks-editor";
import { EditorForm } from "@/components/editor-form";
import { ProfileEditor } from "@/components/profile-editor";
import { TogglePublishKit } from "@/components/toggle-publish-kit";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";
import { getEditorDataAction } from "./actions";

interface Props {
  searchParams: Promise<{ kitId: string }>;
}

export default async function EditorPage({ searchParams }: Props) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const params = await searchParams;
  const kitId = params.kitId;

  const data = await getEditorDataAction(kitId);

  if (!data) redirect("/");

  const { kit, profile } = data;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editor</h1>
          <p className="text-muted-foreground">
            Manage content for <span className="font-mono text-primary">{kit.slug}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-card border px-4 py-2 rounded-lg shadow-sm">
          <span className="text-sm text-muted-foreground">Status:</span>
          <TogglePublishKit kitId={kit.id} initialPublished={kit.published} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <ProfileEditor kitId={kit.id} initialProfileData={kit.profileData} profile={profile} />
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

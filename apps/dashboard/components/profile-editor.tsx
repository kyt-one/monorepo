"use client";

import type { Profile, ProfileOverrideData } from "@repo/db";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@repo/ui";
import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { type UpdateState, updateKitProfileAction } from "@/app/editor/actions";
import { AvatarImageUpload } from "./avatar-image-upload";

interface ProfileEditorProps {
  kitId: string;
  initialProfileData: ProfileOverrideData;
  profile: Profile;
}

const initialState: UpdateState = {};

export function ProfileEditor({ kitId, initialProfileData, profile }: ProfileEditorProps) {
  const [state, action, isPending] = useActionState(updateKitProfileAction, initialState);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    initialProfileData.customAvatarUrl || profile.avatarUrl
  );
  const [displayName, setDisplayName] = useState(
    initialProfileData.displayName || profile.username
  );
  const [tagline, setTagline] = useState(initialProfileData.tagline || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          <input type="hidden" name="kitId" value={kitId} />
          <input type="hidden" name="customAvatarUrl" value={customAvatarUrl} />

          <div className="space-y-3">
            <Label htmlFor="customAvatarUrl">Profile Picture</Label>
            <AvatarImageUpload value={customAvatarUrl} onChange={setCustomAvatarUrl} />
            <p className="text-xs text-muted-foreground">
              Upload a custom picture or leave as default.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              type="text"
              name="displayName"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Josh | Tech Content"
            />
            <p className="text-xs text-muted-foreground">
              Your display name (defaults to username: {profile.username})
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              type="text"
              name="tagline"
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Helping devs build faster"
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {state.error}
            </p>
          )}

          {state.success && (
            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
              Profile settings saved successfully!
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

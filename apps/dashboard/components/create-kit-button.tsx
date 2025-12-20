"use client";

import type { Profile } from "@repo/db";
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { When } from "react-if";
import { createNewKitAction } from "@/app/editor/actions";

interface Props {
  profile: Profile;
}

export function CreateKitButton({ profile }: Props) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPro = profile.tier === "pro";

  const handleCreate = () => {
    if (!slug) return;
    setError("");

    startTransition(async () => {
      const result = await createNewKitAction(slug);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        setSlug("");
        router.refresh();
      }
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus size={16} /> New Kit
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Create New Kit</SheetTitle>
            <SheetDescription>
              Create a tailored kit for a specific sponsor or campaign.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                kyt.one/{profile.username}/
              </span>
              <Input
                placeholder="gaming"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              />
            </div>

            <When condition={!isPro}>
              <div className="p-3 bg-amber-50 text-amber-800 text-sm rounded-md border border-amber-200">
                ⚠️ You are on the Free plan. Upgrading to Pro allows unlimited kits.
              </div>
            </When>

            <When condition={!!error}>
              <p className="text-sm text-destructive">{error}</p>
            </When>
          </div>
          <SheetFooter>
            <Button onClick={handleCreate} disabled={isPending || !slug || !isPro}>
              <When condition={isPending}>
                <Loader2 className="mr-2 size-4 animate-spin" />
              </When>
              Create Kit
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

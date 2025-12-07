"use client";

import {
  Button,
  Input,
  Label,
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

export function CreateKitButton({ isPro }: { isPro: boolean }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        <Plus className="mr-2 size-4" /> New Kit
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New Media Kit</SheetTitle>
            <SheetDescription>
              Create a tailored kit for a specific sponsor or campaign.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label>Kit URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  kyt.one/user/
                </span>
                <Input
                  placeholder="gaming"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Final URL: kyt.one/username/{slug || "slug"}
              </p>
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
            <Button onClick={handleCreate} disabled={isPending || !slug}>
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

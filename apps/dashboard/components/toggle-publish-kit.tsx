"use client";

import { Label, Switch } from "@repo/ui";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { togglePublishKitAction } from "@/app/editor/actions";

interface Props {
  kitId: string;
  initialPublished: boolean;
}

export function TogglePublishKit({ kitId, initialPublished }: Props) {
  const [published, setPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    setPublished(checked);

    startTransition(async () => {
      try {
        toast.success(checked ? "Kit published!" : "Kit unpublished.");
        await togglePublishKitAction(kitId, published);
      } catch {
        setPublished(!checked);
        toast.error("Failed to update status.");
      }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="publish-mode"
        checked={published}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <Label htmlFor="publish-mode" className="font-medium cursor-pointer">
        {published ? "Live" : "Draft"}
      </Label>
    </div>
  );
}

"use client";

import type { MediaKit, Profile } from "@repo/db";
import { Button, cn, toast } from "@repo/ui";
import { getKitUrl } from "@repo/utils";
import { Share2 } from "lucide-react";
import { trackInteractionAction } from "@/app/[...slug]/actions";

interface Props {
  kit: MediaKit;
  profile: Profile;
  className?: string;
}

export function ShareButton({ kit, profile, className }: Props) {
  const handleShare = async () => {
    const url = getKitUrl({ kit, profile });
    const shareData = {
      title: `${profile.username}'s Kyt`,
      text: `Check out my Kyt`,
      url: url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      trackInteractionAction(kit.id, "share", { method: "native_sheet" });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
      trackInteractionAction(kit.id, "share", { method: "clipboard_copy" });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      className={cn(
        "rounded-full shadow-sm bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all",
        className
      )}
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Share Kyt</span>
    </Button>
  );
}

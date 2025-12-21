"use client";

import type { ConnectedAccountStatus } from "@repo/db";
import { Button } from "@repo/ui";
import { getSiteUrl } from "@repo/utils";
import { CheckCircle, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { When } from "react-if";
import { createClient } from "@/lib/utils/supabase/client";

interface Props {
  connected: boolean;
  status?: ConnectedAccountStatus;
}

export function YouTubeConnectButton({ connected, status = "active" }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes:
          "https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.readonly",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: getSiteUrl("/auth/callback/youtube"),
      },
    });

    if (error) setIsLoading(false);
  };

  if (connected && status === "active") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-200">
        <CheckCircle className="size-4" />
        <span className="font-medium">YouTube Connected</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleConnect} disabled={isLoading} variant="outline" className="gap-2">
        <When condition={isLoading}>
          <Loader2 className="size-4 animate-spin" />
        </When>
        <When condition={!isLoading}>
          <LogIn className="size-4" />
        </When>
        Connect YouTube Channel
      </Button>
    </div>
  );
}

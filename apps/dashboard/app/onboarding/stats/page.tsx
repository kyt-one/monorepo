"use client";

import { Button } from "@repo/ui";
import { getSiteUrl } from "@repo/utils";
import { useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";

export default function ConnectStatsPage() {
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

    if (error) {
      console.error("OAuth Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Connect Stats</h1>
          <p className="text-muted-foreground">
            We need read-only access to your YouTube Analytics to build your verified growth graphs.
          </p>
        </div>

        <Button size="lg" className="w-full" onClick={handleConnect} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect YouTube Channel"}
        </Button>

        <p className="text-xs text-muted-foreground px-8">
          By connecting, you grant Kyt permission to read your public channel info and analytics
          reports. We never modify your account.
        </p>
      </div>
    </div>
  );
}

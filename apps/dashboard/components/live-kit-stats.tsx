"use client";

import type { MediaKitStats } from "@repo/db";
import { cn } from "@repo/ui";
import { shortNumber } from "@repo/utils";
import { Eye, MousePointerClick, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";

interface Props {
  kitId: string;
  initialStats: MediaKitStats;
  className?: string;
}

export function LiveKitStats({ kitId, initialStats, className }: Props) {
  const [stats, setStats] = useState(initialStats);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`dashboard-kit-${kitId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "media_kit_events",
          filter: `kit_id=eq.${kitId}`,
        },
        (payload) => {
          console.log(payload);
          const type = payload.new.event_type;

          setStats((prev) => ({
            ...prev,
            views: type === "view" ? prev.views + 1 : prev.views,
            shares: type === "share" ? prev.shares + 1 : prev.shares,
            contacts: type === "contact_click" ? prev.contacts + 1 : prev.contacts,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [kitId, supabase]);

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md border text-center transition-all duration-300 animate-in fade-in">
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
          <Eye className="w-3 h-3" /> Views
        </div>
        <span className="font-bold text-lg tabular-nums">{shortNumber(stats.views)}</span>
      </div>

      <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md border text-center transition-all duration-300 animate-in fade-in">
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
          <Share2 className="w-3 h-3" /> Shares
        </div>
        <span className="font-bold text-lg tabular-nums">{shortNumber(stats.shares)}</span>
      </div>

      <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md border text-center transition-all duration-300 animate-in fade-in">
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
          <MousePointerClick className="w-3 h-3" /> Clicks
        </div>
        <span className="font-bold text-lg tabular-nums">{shortNumber(stats.contacts)}</span>
      </div>
    </div>
  );
}

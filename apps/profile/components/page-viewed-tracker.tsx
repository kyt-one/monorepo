"use client";

import { useEffect, useRef } from "react";
import { trackInteractionAction } from "@/app/[...slug]/actions";

export function PageViewedTracker({ kitId }: { kitId: string }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const sessionKey = `viewed_${kitId}`;
    const hasViewed = sessionStorage.getItem(sessionKey);

    if (!hasViewed) {
      trackInteractionAction(kitId, "view", {
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`,
        userAgent: navigator.userAgent,
        language: navigator.language,
      });

      sessionStorage.setItem(sessionKey, "true");
    }
  }, [kitId]);

  return null;
}

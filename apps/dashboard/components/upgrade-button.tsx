"use client";

import type { SubscriptionInterval, SubscriptionTier } from "@repo/db";
import { Button } from "@repo/ui";
import { getCheckoutUrl } from "@repo/utils";
import { Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { When } from "react-if";

interface Props {
  tier: SubscriptionTier;
  interval: SubscriptionInterval;
  productId: string;
  variantId: string;
  userId: string;
  buttonText: string;
  className?: string;
}

export function UpgradeButton({
  interval,
  tier,
  productId,
  variantId,
  userId,
  buttonText,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    const url = getCheckoutUrl({ productId, variantId, userId, interval, tier });
    window.location.href = url;
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className={className}>
      <When condition={loading}>
        <Loader2 className="mr-2 size-4 animate-spin" />
      </When>
      <When condition={!loading}>
        <Zap className="mr-2 size-4" />
      </When>
      {buttonText}
    </Button>
  );
}

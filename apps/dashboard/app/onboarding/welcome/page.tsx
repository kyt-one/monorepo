"use client";

import { Button, Card, CardContent } from "@repo/ui";
import { BarChart3, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useState, useTransition } from "react";
import { completeWelcomeStep } from "../actions";

export default function OnboardingFinalPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFinish = () => {
    startTransition(async () => {
      const result = await completeWelcomeStep();

      if (result.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-muted/10">
      <div className="w-full max-w-2xl text-center space-y-10">
        <div className="space-y-4">
          <div className="mx-auto size-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Verification Complete!</h1>
          <p className="text-xl text-muted-foreground">
            Your YouTube stats have been securely synced. You are now ready to build a trusted media
            kit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <FeatureCard
            icon={<ShieldCheck className="size-5 text-blue-500" />}
            title="Verified Data"
            description="Brands trust API data over screenshots. You are now verified."
          />
          <FeatureCard
            icon={<BarChart3 className="size-5 text-purple-500" />}
            title="Auto-Updating"
            description="We track your 30-day growth history automatically."
          />
          <FeatureCard
            icon={<Zap className="size-5 text-orange-500" />}
            title="Instant Sharing"
            description="Create unlimited tailored links for different sponsors."
          />
        </div>

        <div className="flex-col gap-4 pt-6">
          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button
            size="lg"
            className="w-full md:w-auto px-12 h-12 text-base"
            onClick={handleFinish}
            disabled={isPending}
          >
            {isPending ? "Entering Dashboard..." : "Go to Dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-sm bg-background/60 backdrop-blur">
      <CardContent className="pt-6 space-y-2">
        <div className="p-2 bg-muted rounded-md w-fit">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

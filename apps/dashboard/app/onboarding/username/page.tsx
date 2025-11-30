"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormInput } from "@repo/ui";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { OnboardingUsernameSchema, type OnboardingUsernameValues } from "@/lib/schemas/onboarding";
import { completeUsernameStep } from "../actions";

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingUsernameValues>({
    resolver: zodResolver(OnboardingUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (data: OnboardingUsernameValues) => {
    startTransition(async () => {
      const result = await completeUsernameStep(data);

      if (result) {
        if (result.fieldErrors?.username) {
          form.setError("username", {
            type: "server",
            message: result.fieldErrors.username[0],
          });
        }

        if (result.error) {
          form.setError("root", {
            type: "server",
            message: result.error,
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Claim your handle</h1>
          <p className="text-muted-foreground mt-2">Choose a unique username for your media kit.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            control={form.control}
            name="username"
            label="Username"
            placeholder="kyt.one/username"
            description="Only lowercase letters, numbers, and underscores."
            autoFocus
          />

          {form.formState.errors.root && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium text-center">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? "Claiming..." : "Claim Handle"}
          </Button>
        </form>
      </div>
    </div>
  );
}

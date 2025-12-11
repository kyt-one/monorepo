"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Else, If, Then } from "react-if";
import { AvatarImageUpload } from "@/components/avatar-image-upload";
import { OnboardingAvatarSchema, type OnboardingAvatarValues } from "@/lib/schemas/onboarding";
import { completeAvatarStepAction } from "../actions";

export default function AvatarOnboardingPage() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingAvatarValues>({
    resolver: zodResolver(OnboardingAvatarSchema),
    defaultValues: {
      avatarUrl: "",
    },
  });

  const onSubmit = (data: OnboardingAvatarValues) => {
    startTransition(async () => {
      const result = await completeAvatarStepAction(data);

      if (result) {
        if (result.fieldErrors?.avatarUrl) {
          form.setError("avatarUrl", {
            type: "server",
            message: result.fieldErrors.avatarUrl[0],
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

  const { errors } = form.formState;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add a profile picture</h1>
          <p className="text-muted-foreground mt-2">Upload a photo to help brands recognize you.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-center py-6">
            <AvatarImageUpload
              value={form.watch("avatarUrl")}
              onChange={(url) => {
                form.setValue("avatarUrl", url, { shouldValidate: true });
              }}
              disabled={isPending}
            />
          </div>

          {errors.avatarUrl && (
            <p className="text-sm text-destructive font-medium">{errors.avatarUrl.message}</p>
          )}

          {errors.root && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {errors.root.message}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            <If condition={isPending}>
              <Then>Saving...</Then>
              <Else>Continue</Else>
            </If>
          </Button>
        </form>
      </div>
    </div>
  );
}

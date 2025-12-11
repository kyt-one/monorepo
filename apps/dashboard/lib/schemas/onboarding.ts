import type { Enums } from "@repo/db";
import { z } from "zod";

export const OnboardingUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_]+$/, "Username must be lowercase, numbers, or underscores only")
    .transform((val) => val.toLowerCase()),
});

export const OnboardingAvatarSchema = z.object({
  avatarUrl: z.string().min(1, "Please upload an avatar"),
});

export interface OnboardingFlowStep {
  step: Enums<"onboarding_steps">;
  path: string;
}

export type OnboardingUsernameValues = z.infer<typeof OnboardingUsernameSchema>;
export type OnboardingAvatarValues = z.infer<typeof OnboardingAvatarSchema>;

"use server";

import { createDefaultKit } from "@repo/utils/server";
import { redirect } from "next/navigation";
import {
  OnboardingAvatarSchema,
  type OnboardingAvatarValues,
  OnboardingUsernameSchema,
  type OnboardingUsernameValues,
} from "@/lib/schemas/onboarding";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

export type UsernameStepActionState = {
  error?: string;
  fieldErrors?: {
    username?: string[];
  };
};

export type AvatarStepActionState = {
  error?: string;
  fieldErrors?: {
    avatarUrl?: string[];
  };
};

export type WelcomeStepActionState = {
  error?: string;
};

export async function completeUsernameStepAction(
  data: OnboardingUsernameValues
): Promise<UsernameStepActionState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const validated = OnboardingUsernameSchema.safeParse(data);
  if (!validated.success) {
    return {
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const { username } = validated.data;

  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUser && existingUser.id !== user.id) {
    return {
      fieldErrors: {
        username: ["Username is already taken."],
      },
    };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  if (updateError) {
    console.error("Profile Update Error:", updateError);
    return { error: "Failed to save username. Please try again." };
  }

  const { error: rpcError } = await supabase.rpc("complete_onboarding_step", {
    step_name: "username",
  });

  if (rpcError) return { error: "Failed to update progress." };

  redirect("/onboarding/avatar");
}

export async function completeAvatarStepAction(
  data: OnboardingAvatarValues
): Promise<AvatarStepActionState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const validated = OnboardingAvatarSchema.safeParse(data);
  if (!validated.success) {
    return {
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const { avatarUrl } = validated.data;
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (updateError) return { error: "Failed to save avatar." };

  const { error: rpcError } = await supabase.rpc("complete_onboarding_step", {
    step_name: "avatar",
  });
  if (rpcError) return { error: "Failed to update progress." };

  redirect("/onboarding/stats");
}

export async function completeWelcomeStepAction(): Promise<WelcomeStepActionState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  await createDefaultKit(user.id);

  const { error: rpcError } = await supabase.rpc("complete_onboarding_step", {
    step_name: "welcome",
  });

  if (rpcError) return { error: "Failed to update progress." };

  redirect("/");
}

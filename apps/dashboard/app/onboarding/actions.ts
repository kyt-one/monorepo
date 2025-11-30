"use server";

import { redirect } from "next/navigation";
import { OnboardingUsernameSchema, type OnboardingUsernameValues } from "@/lib/schemas/onboarding";
import { createClient } from "@/lib/utils/supabase/server";

export type UsernameStepActionState = {
  error?: string;
  fieldErrors?: {
    username?: string[];
  };
};

export type WelcomeStepActionState = {
  error?: string;
};

export async function completeUsernameStep(
  data: OnboardingUsernameValues
): Promise<UsernameStepActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  redirect("/onboarding/stats");
}

export async function completeWelcomeStep(): Promise<WelcomeStepActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { error: rpcError } = await supabase.rpc("complete_onboarding_step", {
    step_name: "welcome",
  });

  if (rpcError) return { error: "Failed to update progress." };

  redirect("/");
}

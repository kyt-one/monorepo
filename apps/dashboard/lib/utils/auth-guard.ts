import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { OnboardingFlowStep } from "@/lib/schemas/onboarding";
import { createClient } from "@/lib/utils/supabase/server";
import { getCurrentUser } from "./current-user";

const OnboardingFlow: OnboardingFlowStep[] = [
  { step: "username", path: "/onboarding/username" },
  { step: "stats", path: "/onboarding/stats" },
  { step: "welcome", path: "/onboarding/welcome" },
];

export async function authGuard() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";
  const isAuthRoute = pathname.startsWith("/auth");

  if (!user && !isAuthRoute) redirect("/auth/sign-in");
  if (user && isAuthRoute) redirect("/");

  if (user && !isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_steps")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.auth.signOut();
      redirect("/auth/sign-in");
    }

    const completedSteps = profile.onboarding_steps;

    for (const { step, path } of OnboardingFlow) {
      if (!completedSteps.includes(step)) {
        if (pathname !== path) redirect(path);
        return;
      }
    }

    if (pathname.startsWith("/onboarding")) redirect("/");
  }
}

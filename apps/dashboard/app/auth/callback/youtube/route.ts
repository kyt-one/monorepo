import { NextResponse } from "next/server";
import { fetchAndSaveYouTubeStats } from "@/lib/services/youtube";
import { createClient } from "@/lib/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = "/onboarding/welcome";

  if (!code) {
    return NextResponse.redirect(`${origin}/onboarding/stats?error=No code provided`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("Auth Error:", error);
    return NextResponse.redirect(`${origin}/onboarding/stats?error=Auth failed`);
  }

  const providerToken = data.session.provider_token;
  const providerRefreshToken = data.session.provider_refresh_token || undefined;

  if (!providerToken) {
    console.error("No provider token found in session");
    return NextResponse.redirect(`${origin}/onboarding/stats?error=No provider token`);
  }

  try {
    await fetchAndSaveYouTubeStats(data.session.user.id, providerToken, providerRefreshToken);
    await supabase.rpc("complete_onboarding_step", {
      step_name: "stats",
    });

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error("YouTube Fetch Error:", err);
    return NextResponse.redirect(`${origin}/onboarding/stats?error=Failed to fetch stats`);
  }
}

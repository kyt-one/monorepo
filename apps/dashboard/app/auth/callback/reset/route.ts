import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      const nextPath = "/auth/reset-password";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${nextPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${nextPath}`);
      } else {
        return NextResponse.redirect(`${origin}${nextPath}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

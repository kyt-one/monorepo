"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${BASE_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    console.error(error);
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/auth/sign-in?error=" + error.message);
  }

  return redirect("/auth/sign-in?message=Check email to continue sign in process");
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/auth/sign-in?error=" + error.message);
  }

  return redirect("/");
}

"use server";

import { redirect } from "next/navigation";
import { getSiteUrl } from "@/utils/get-site-url";
import { createClient } from "@/utils/supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getSiteUrl("/auth/callback"),
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
      emailRedirectTo: getSiteUrl("/auth/callback"),
    },
  });

  if (error) {
    return redirect(`/auth/sign-in?error=${error.message}`);
  }

  return redirect(`/auth/sign-in?message=Check email to continue sign in process`);
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
    return redirect(`/auth/sign-in?error=${error.message}`);
  }

  return redirect("/");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getSiteUrl("/auth/callback/reset"),
  });

  if (error) {
    return redirect(`/auth/forgot-password?error=${error.message}`);
  }

  return redirect("/auth/forgot-password?message=Check email to reset password");
}

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const supabase = await createClient();

  if (password !== confirmPassword) {
    return redirect("/auth/reset-password?error=Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return redirect(`/auth/reset-password?error=${error.message}`);
  }

  return redirect("/");
}

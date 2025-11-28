"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormInput,
} from "@repo/ui";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { type SignInValues, signInSchema } from "@/lib/schemas/auth";
import { signInWithEmail, signInWithGoogle } from "../actions";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    await signInWithEmail(formData);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email below to sign in to your account</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-2.5">
              <FormInput
                control={control}
                name="email"
                label="Email"
                type="email"
                placeholder="hello@kyt.one"
              />

              <div className="flex-col items-end gap-2">
                <FormInput
                  control={control}
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="********"
                />

                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-muted-foreground underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button className="mt-2 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In with Email"}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form action={signInWithGoogle}>
            <Button variant="outline" type="submit" className="w-full">
              Google
            </Button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

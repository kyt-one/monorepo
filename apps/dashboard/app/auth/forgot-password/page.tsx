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
import { type ForgotPasswordValues, forgotPasswordSchema } from "@/lib/schemas/auth";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    const formData = new FormData();
    formData.append("email", data.email);

    await forgotPassword(formData);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email below to reset your password</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-2">
            <FormInput
              control={control}
              name="email"
              label="Email"
              type="email"
              placeholder="hello@kyt.one"
            />

            <Button className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

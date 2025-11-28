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
import { type SignUpValues, signUpSchema } from "@/lib/schemas/auth";
import { signInWithGoogle, signUpWithEmail } from "../actions";

export default function SignUpPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    await signUpWithEmail(formData);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <FormInput
                  control={control}
                  name="email"
                  label="Email"
                  placeholder="hello@kyt.one"
                />
              </div>
              <div className="grid gap-1">
                <FormInput
                  control={control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="********"
                />
              </div>
              <Button className="mt-2 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing Up..." : "Sign Up with Email"}
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
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

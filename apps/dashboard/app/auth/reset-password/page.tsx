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
import { useForm } from "react-hook-form";
import { type UpdatePasswordValues, updatePasswordSchema } from "@/lib/schemas/auth";
import { resetPassword } from "../actions";

export default function ResetPasswordPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UpdatePasswordValues) => {
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    await resetPassword(formData);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormInput
                control={control}
                name="password"
                label="New Password"
                type="password"
                placeholder="********"
              />

              <FormInput
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="********"
              />

              <Button className="mt-2 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

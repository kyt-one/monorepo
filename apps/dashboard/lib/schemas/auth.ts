import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
  password: z.string().min(1, "Required"),
});

export const signUpSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
  password: z.string().min(6, "Must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

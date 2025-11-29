import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
  password: z.string().min(1, "Required"),
});

export const SignUpSchema = z
  .object({
    email: z.string().min(1, "Required").email("Invalid email address"),
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
});

export const UpdatePasswordSchema = z
  .object({
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInValues = z.infer<typeof SignInSchema>;
export type SignUpValues = z.infer<typeof SignUpSchema>;
export type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;
export type UpdatePasswordValues = z.infer<typeof UpdatePasswordSchema>;

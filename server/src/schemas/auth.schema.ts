import { z } from "zod";

/** Schema for user registration */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter and one number"
    ),
});

/** Schema for user login */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/** Inferred TypeScript type for registration input */
export type RegisterInput = z.infer<typeof registerSchema>;

/** Inferred TypeScript type for login input */
export type LoginInput = z.infer<typeof loginSchema>;

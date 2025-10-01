// src/lib/validation/schemas.ts
import { z } from "zod";

/**
 * AUTH SCHEMAS
 */

export const RegisterSchema = z
  .object({
    email: z.string().email("Nieprawidłowy adres e-mail"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/\d.*\d.*\d/, {
        message: "Hasło musi zawierać co najmniej 3 cyfry",
      }),
    confirmPassword: z.string(),
    agreeTerms: z.preprocess(
  (val) => val === "on",
  z.literal(true, {       message: "Musisz zaakceptować regulamin, aby się zarejestrować",
})
),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

export const LoginSchema = z
  .object({
    email: z.string().email({ message: "Nieprawidłowy adres e-mail" }),
    password: z.string().min(1, { message: "Hasło jest wymagane" }),
  })
  .strict();
    

/**
 * PROFILE SCHEMAS
 */
export const ProfileSchema = z.object({});

/**
 * CHECKOUT / PURCHASE SCHEMAS
 */
export const CheckoutSchema = z.object({});

/**
 * PROGRESS SCHEMAS
 */
export const ProgressSchema = z.object({});

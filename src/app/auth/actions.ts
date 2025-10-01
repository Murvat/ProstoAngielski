'use server'

import { createClient } from '@/lib/supabase/server/server' 
import { RegisterSchema, LoginSchema } from "@/lib/validation/schemas";

export type SignupState = {
  success: boolean | null;
  errors?: Record<string, string[]>;
  email?: string;
};
export type LoginState = {
  success: boolean | null;
  errors?: Record<string, string[]>;
};

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, errors: { form: [error.message] } };
  }

  return { success: true };
}

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const supabase = await createClient();

const data = {
  email: formData.get("email"),
  password: formData.get("password"),
  confirmPassword: formData.get("confirmPassword"),
  agreeTerms: formData.get("agreeTerms"), // 👈 add this
};

  const parsed = RegisterSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data; // 👈 confirmPassword is validated but not sent to Supabase

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { success: false, errors: { form: [error.message] } };
  }

  return { success: true, email };
}


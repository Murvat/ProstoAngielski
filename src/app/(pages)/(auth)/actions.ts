"use server";

import { createClient } from "@/lib/supabase/server/server"; // ✅ correct import
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
    agreeTerms: formData.get("agreeTerms"),
  };

  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  // ⚠️ Remove this — not allowed
  // const { data: existingUser, error: fetchError } = await supabase
  //   .from("auth.users")
  //   .select("email")
  //   .eq("email", email)
  //   .maybeSingle();

  // ✅ Let Supabase handle duplicates automatically
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return {
        success: false,
        errors: {
          email: [
            "Ten adres e-mail jest już zarejestrowany. Jeśli używasz logowania Google, zaloguj się przyciskiem „Zaloguj przez Google”.",
          ],
        },
      };
    }
    return { success: false, errors: { form: [error.message] } };
  }

  return { success: true, email };
}

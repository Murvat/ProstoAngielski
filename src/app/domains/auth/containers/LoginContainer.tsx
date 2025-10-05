// src/app/auth/containers/LoginContainer.tsx
"use client";
import { useActionState, useEffect } from "react";
import { login, type LoginState } from "@/app/auth/actions";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useRouter } from "next/navigation";
import AuthForm from "../components/AuthForm";

const initialState: LoginState = { success: null, errors: {} };

export default function LoginContainer() {
  const [state, formAction] = useActionState(login, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/profile");
    }
  }, [state.success, router]);

  return (
    <section className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-center items-center px-6 py-12 text-center">
      <div className="bg-green-50 p-8 rounded-xl shadow-md w-full hover:shadow-lg transition-shadow cursor-pointer">
        <h1 className="text-xl md:text-2xl leading-snug font-semibold font-sans text-green-800">
          Zaloguj się do swojego konta
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Uzyskaj dostęp do swoich kursów, lekcji i postępów.
        </p>

        <AuthForm
          errors={state.errors}
          submitLabel="Zaloguj się"
          formAction={formAction}
        />

        <div className="flex items-center gap-2 my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">lub</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <GoogleSignInButton />
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Zapomniałeś hasła?{" "}
        <a
          href="/auth/reset"
          className="text-green-600 hover:underline hover:text-green-700 cursor-pointer"
        >
          Zresetuj je tutaj
        </a>
      </p>
    </section>
  );
}

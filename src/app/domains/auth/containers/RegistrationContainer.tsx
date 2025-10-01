"use client";

import { useActionState, useEffect } from "react";
import { signup, type SignupState } from "@/app/auth/actions";
import TitleRegistration from "../components/TitleRegistration";
import BenefitsPayment from "../../payments/components/BenefitsPayment";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useRouter } from "next/navigation";
import AuthForm from "../components/AuthForm";
import Link from "next/link";

const initialState: SignupState = { success: null, errors: {} };

export default function RegistrationContainer() {
  const [state, formAction] = useActionState(signup, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.email) {
      router.push(`/confirm?email=${encodeURIComponent(state.email)}`);
    }
  }, [state.success, state.email, router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left side: Form */}
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <TitleRegistration />

          <AuthForm
            errors={state.errors}
            submitLabel="Sign up"
            includeConfirmPassword
            formAction={formAction}
          />

          {/* Divider */}
{/* Divider */}
<div className="flex items-center gap-2 my-4">
  <hr className="flex-1 border-gray-300" />
  <span className="text-gray-500 text-sm">or</span>
  <hr className="flex-1 border-gray-300" />
</div>

{/* Google Button */}
  <GoogleSignInButton />

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Right side: Benefits */}
        <BenefitsPayment />
      </div>
    </section>
  );
}

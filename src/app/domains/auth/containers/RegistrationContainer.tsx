"use client";

import { useActionState, useEffect } from "react";
import { signup, type SignupState } from "@/app/auth/actions";
import TitleRegistration from "../components/TitleRegistration";
import BenefitsPayment from "../../payments/components/BenefitsPayment";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useRouter } from "next/navigation";
import AuthForm from "../components/AuthForm";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-100 px-6 py-12 overflow-hidden">
      {/* ✨ Background glow (lightened for performance) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.08),_transparent_70%)]"
      />

      {/* 🧩 Main content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/75 backdrop-blur-xl border border-green-100 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* 🟩 Left side – Logo + Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center md:items-start gap-3 mb-6"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logoweb.svg"
                alt="Logo"
                width={55}
                height={55}
                className="drop-shadow-sm"
              />
              <h1 className="text-2xl font-extrabold text-green-700 tracking-tight">
                PROSTOANGIELSKI
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base max-w-md">
              Ucz się angielskiego skutecznie — bez stresu i abonamentu.
            </p>
          </motion.div>

          {/* Title & Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full"
          >
            <TitleRegistration />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 w-full"
          >
            <AuthForm
              errors={state.errors}
              submitLabel="Zarejestruj się"
              includeConfirmPassword
              formAction={formAction}
            />
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4 w-full">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">lub</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Google Login */}
          <motion.div whileHover={{ scale: 1.02 }} className="w-full">
            <GoogleSignInButton />
          </motion.div>

          {/* Already have account */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Masz już konto?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 hover:underline font-medium"
            >
              Zaloguj się
            </Link>
          </p>
        </div>

        {/* 🌿 Right side – Benefits section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-500 to-green-400 text-white relative"
        >
          <div className="relative z-10 p-10 text-center flex flex-col items-center">
            <h2 className="text-3xl font-extrabold mb-3">Dlaczego warto?</h2>
            <p className="max-w-md text-white/90 leading-relaxed mb-5">
              Zdobądź pełny dostęp do kursów, materiałów PDF i interaktywnych
              lekcji — wszystko bez ukrytych kosztów.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <BenefitsPayment />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

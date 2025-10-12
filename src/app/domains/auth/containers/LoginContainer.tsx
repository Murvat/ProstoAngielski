"use client";

import { useActionState, useEffect } from "react";
import { login, type LoginState } from "@/app/auth/actions";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useRouter } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { motion } from "framer-motion";
import Image from "next/image";

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
    <section className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-green-50 via-white to-emerald-100 overflow-hidden">
      {/* 🌿 Left Side (Logo + Intro) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex md:w-1/2 flex-col justify-center items-center text-center bg-gradient-to-br from-green-600 via-emerald-500 to-green-400 text-white p-12 relative overflow-hidden"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_70%)]"
        ></motion.div>

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Image
            src="/logoweb.svg"
            alt="Logo"
            width={80}
            height={80}
            className="drop-shadow-lg"
          />
          <h1 className="text-3xl font-extrabold tracking-tight">
            PROSTOANGIELSKI
          </h1>
          <p className="max-w-sm text-lg text-white/90 mt-2 leading-relaxed">
            Nauka angielskiego bez stresu i abonamentu.  
            Ucz się w prosty, skuteczny sposób!
          </p>
        </div>
      </motion.div>

      {/* 🟢 Right Side (Login Form) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-16 md:py-0 relative"
      >
        {/* Background glow (right side) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,_rgba(16,185,129,0.08),_transparent_70%)]"
        ></motion.div>

        {/* Card */}
        <div className="relative z-10 bg-white/70 backdrop-blur-xl border border-green-100 rounded-3xl shadow-2xl p-8 w-full max-w-md hover:shadow-green-100/40 transition-all">
          <h2 className="text-2xl md:text-3xl font-extrabold font-sans bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text text-center">
            Zaloguj się do swojego konta
          </h2>

          <p className="text-gray-600 text-sm md:text-base mt-2 text-center">
            Uzyskaj dostęp do swoich kursów, lekcji i postępów.
          </p>

          <div className="mt-8 w-full">
            <AuthForm
              errors={state.errors}
              submitLabel="Zaloguj się"
              formAction={formAction}
            />
          </div>

          <div className="flex items-center gap-3 my-6 w-full">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">lub</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            <GoogleSignInButton />
          </motion.div>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Zapomniałeś hasła?{" "}
            <a
              href="/reset"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Zresetuj je tutaj
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { useFormState } from "react-dom";
import { login, type LoginState } from "@/app/(pages)/(auth)/actions";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const initialState: LoginState = { success: null, errors: {} };

export default function LoginContainer() {
  const [state, formAction] = useFormState(login, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTarget = useMemo(() => {
    const candidate = searchParams.get("next");
    if (!candidate) return "/profile";
    if (!candidate.startsWith("/") || candidate.startsWith("//")) return "/profile";
    if (candidate === "/login") return "/profile";
    return candidate;
  }, [searchParams]);

  useEffect(() => {
    if (state.success) {
      router.push(redirectTarget);
    }
  }, [state.success, router, redirectTarget]);

  return (
    <section className="flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100 md:flex-row">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative hidden w-full items-center justify-center bg-gradient-to-br from-green-600 via-emerald-500 to-green-400 p-12 text-center text-white md:flex md:w-1/2"
      >
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_70%)]"
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Image src="/logoweb.svg" alt="Logo ProstoAngielski" width={80} height={80} className="drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold tracking-tight">PROSTOANGIELSKI</h1>
          <p className="mt-2 max-w-sm text-lg text-white/90 leading-relaxed">
            Nauka angielskiego bez stresu i abonamentu. Ucz się szybko, skutecznie i z polskimi wyjaśnieniami.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex w-full flex-col items-center justify-center px-6 py-16 md:w-1/2 md:py-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,_rgba(16,185,129,0.08),_transparent_70%)]"
        />

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-green-100 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition-all hover:shadow-green-100/40">
          <h2 className="bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 bg-clip-text text-center text-2xl font-extrabold text-transparent md:text-3xl">
            Zaloguj się do swojego konta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 md:text-base">
            Otrzymasz dostęp do kursów, statystyk i strefy praktyk.
          </p>

          <div className="mt-8 w-full">
            <AuthForm errors={state.errors} submitLabel="Zaloguj się" formAction={formAction} />
          </div>

          <div className="my-6 flex w-full items-center gap-3">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-500">lub</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
            <GoogleSignInButton />
          </motion.div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Zapomniałeś hasła?{" "}
            <Link href="/reset" className="text-green-600 hover:text-green-700 hover:underline">
              Zresetuj je tutaj
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-gray-600">
            Nie masz konta?{" "}
            <Link href="/signup" className="text-green-600 hover:text-green-700 hover:underline">
              Zarejestruj się, aby dołączyć
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { Megaphone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type PromoBannerProps = {
  className?: string;
};

export default function PromoBanner({ className = "" }: PromoBannerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative isolate mt-20 overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 py-6 ${className}`}
    >
      <div
        className="absolute inset-y-0 left-1/3 w-1/2 bg-white/10 blur-3xl opacity-40"
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-4 text-white md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
            <Megaphone className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              Specjalna oferta
            </p>
            <h2 className="text-lg font-semibold md:text-2xl">
              25 darmowych lekcji w każdym temacie + 250 testów, 250 fiszek i 1500 słówek
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
          <p className="max-w-sm text-sm text-white/90 md:text-base">
            Sprawdź się bez logowania: dla każdego poziomu przygotowaliśmy 250 testów, 250 fiszek i 1500 haseł
            słownictwa, abyś mógł swobodnie ocenić swoje postępy.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            Zarejestruj się teraz
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

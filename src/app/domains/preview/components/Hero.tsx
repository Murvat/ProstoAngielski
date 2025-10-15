"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-100">
      {/* === BACKGROUND EFFECTS === */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient blobs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-green-300 via-emerald-200 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: 0.3, duration: 2 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-200 via-yellow-100 to-transparent rounded-full blur-3xl"
        />
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.07),_transparent_70%)]" />
      </div>

      {/* === LEFT: IMAGE === */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        viewport={{ once: true }}
        className="flex-1 flex justify-center relative z-10"
      >
        {/* Floating Glow Behind Image */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-green-300 via-emerald-200 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="relative z-10"
        >
          <Image
            src="/hero3.png"
            alt="hero"
            width={620}
            height={380}
            className="w-full max-w-lg h-auto rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
        </motion.div>
      </motion.div>

      {/* === RIGHT: TEXT + BUTTONS === */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex-1 flex flex-col items-center md:items-start gap-8 text-center md:text-left relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-snug bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(16,185,129,0.2)]">
          Ucz się angielskiego skutecznie i bez stresu — specjalnie dla Polaków!
        </h1>

        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
          Ucz się języka angielskiego w sposób prosty, jasny i skuteczny.
          Zrozum gramatykę, opanuj słownictwo i zobacz prawdziwe postępy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-2">
          {/* Primary Button */}
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 25px rgba(249,115,22,0.5)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/signup")}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-rose-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            Załóż konto
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            whileHover={{
              scale: 1.08,
              backgroundColor: "rgba(16,185,129,0.1)",
              boxShadow: "0 0 20px rgba(16,185,129,0.3)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/login")}
            className="w-full py-3 px-6 border-2 border-green-600 text-green-700 font-semibold rounded-full bg-white hover:bg-green-50 transition-all duration-300"
          >
            Zaloguj się
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

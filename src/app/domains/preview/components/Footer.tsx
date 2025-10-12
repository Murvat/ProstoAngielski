"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-white via-green-50 to-emerald-100 border-t border-green-200">
      {/* 🌈 Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.15),_transparent_70%)]"
      ></motion.div>

      {/* 🌿 Main CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-screen-xl mx-auto py-20 px-6 flex flex-col items-center text-center gap-6"
      >
        <h2 className="font-sans font-extrabold text-3xl md:text-5xl leading-tight bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text">
          Ucz się angielskiego skutecznie
        </h2>

        <p className="text-gray-700 text-base md:text-lg max-w-md">
          Dołącz do tysięcy Polaków, którzy uczą się języka z nami każdego dnia.
        </p>

        <motion.button
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 25px rgba(249,115,22,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/signup")}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-10 rounded-full transition-all duration-300 shadow-lg"
        >
          Załóż konto
        </motion.button>
      </motion.div>

      {/* 🌿 Divider Line */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="w-full h-[1px] bg-gradient-to-r from-transparent via-green-300 to-transparent"
      />

      {/* 🌍 Bottom Bar */}
      <div className="relative z-10 max-w-screen-xl mx-auto py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center md:justify-start gap-6"
        >
          <Link
            href="/contact"
            className="hover:text-green-600 transition-colors duration-300"
          >
            Kontakt
          </Link>
          <Link
            href="/privacy"
            className="hover:text-green-600 transition-colors duration-300"
          >
            Prywatność
          </Link>
          <Link
            href="/terms"
            className="hover:text-green-600 transition-colors duration-300"
          >
            Regulamin
          </Link>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-gray-500"
        >
          &copy; {new Date().getFullYear()} ProstoAngielski. Wszelkie prawa zastrzeżone.
        </motion.div>
      </div>
    </footer>
  );
}

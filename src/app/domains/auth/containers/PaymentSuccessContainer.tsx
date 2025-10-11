"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type PaymentSuccessProps = {
  purchase: {
    userName: string;
    courseTitle: string;
    amount: string;
    access: string;
  };
};

export default function PaymentSuccessContainer({ purchase }: PaymentSuccessProps) {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* 💫 Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.15),_transparent_70%)]"
      ></motion.div>

      {/* 🟢 Success Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center"
      >
        {/* Icon Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 10,
            delay: 0.2,
          }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-full bg-green-100 text-green-600 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-green-700 mb-2"
        >
          Płatność zakończona sukcesem!
        </motion.h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Dziękujemy, <span className="font-semibold text-gray-800">{purchase.userName}</span>!
          <br />
          Kurs <strong>{purchase.courseTitle}</strong> został pomyślnie zakupiony.
        </p>

        {/* 🧾 Purchase Summary */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-gray-700 mb-8">
          <p>
            <strong>Kurs:</strong> {purchase.courseTitle}
          </p>
          <p>
            <strong>Kwota:</strong> {purchase.amount}
          </p>
          <p>
            <strong>Dostęp:</strong> {purchase.access}
          </p>
        </div>

        {/* 🚀 CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/profile")}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
                     text-white font-semibold shadow-lg hover:from-green-600 hover:to-emerald-600 
                     active:scale-95 transition-all duration-300"
        >
          Rozpocznij naukę
        </motion.button>
      </motion.div>

      {/* ✨ Floating Glow Orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute bottom-10 left-10 w-32 h-32 bg-green-200/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute top-20 right-16 w-40 h-40 bg-emerald-100/40 rounded-full blur-3xl"
      />
    </section>
  );
}

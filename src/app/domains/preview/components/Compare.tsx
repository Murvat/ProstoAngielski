"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function ComparePreview() {
  const card = (title: string, color: "green" | "red", items: string[]) => (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateX: 2,
        rotateY: -2,
        boxShadow:
          color === "green"
            ? "0 15px 35px rgba(16,185,129,0.3)"
            : "0 15px 35px rgba(239,68,68,0.3)",
      }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className={`relative w-full max-w-md rounded-3xl p-8 border backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden
        ${
          color === "green"
            ? "bg-gradient-to-br from-white/70 via-emerald-50 to-green-100 border-emerald-200"
            : "bg-gradient-to-br from-white/70 via-rose-50 to-red-100 border-rose-200"
        }
      `}
    >
      {/* Gradient Border Glow */}
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -inset-[2px] rounded-3xl blur-lg ${
          color === "green"
            ? "bg-gradient-to-r from-green-400/60 via-emerald-300/60 to-teal-400/40"
            : "bg-gradient-to-r from-red-400/60 via-pink-300/60 to-rose-400/40"
        }`}
      ></motion.div>

      {/* Inner Content */}
      <div className="relative z-10">
        <h3
          className={`text-2xl font-extrabold text-center mb-6 ${
            color === "green"
              ? "text-green-700 drop-shadow-[0_1px_4px_rgba(16,185,129,0.3)]"
              : "text-red-600 drop-shadow-[0_1px_4px_rgba(239,68,68,0.3)]"
          }`}
        >
          {title}
        </h3>

        <ul className="flex flex-col gap-4">
          {items.map((i, idx) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: color === "green" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: idx * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="flex items-start gap-3"
            >
              {color === "green" ? (
                <CheckCircle className="w-6 h-6 text-green-600 shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 shrink-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              )}
              <p className="text-gray-800 text-base font-medium leading-snug">
                {i}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Light glow orb */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute w-40 h-40 rounded-full blur-3xl ${
          color === "green"
            ? "bg-green-300/50 top-10 left-10"
            : "bg-red-300/50 bottom-10 right-10"
        }`}
      />
    </motion.div>
  );

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-24 flex flex-col gap-16 items-center relative overflow-hidden">
      {/* Animated Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15),_transparent_70%)]"
      ></motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text drop-shadow-[0_4px_10px_rgba(16,185,129,0.25)]"
      >
        Czym się różni nasza aplikacja?
      </motion.h2>

      {/* Cards */}
      <div className="flex flex-col lg:flex-row justify-center gap-10">
        {card("Nasza Aplikacja", "green", [
          "Jednorazowa opłata, bez abonamentu",
          "Kurs stworzony specjalnie dla Polaków",
          "Gramatyka, słownictwo, wszystko czego potrzebujesz",
          "Proste, jasne wyjaśnienia",
          "Praktyczne przykłady",
          "Materiały PDF do pobrania",
        ])}

        {card("Inne Aplikacje", "red", [
          "Miesięczny abonament – płacisz bez końca",
          "Brak końca – nie wiesz, kiedy to skończysz",
          "Wolniejsze tempo materiału – żebyś został w systemie jak najdłużej",
          "Brak realnych efektów",
          "Reklamy, rozpraszacze",
          "Niska motywacja – nie widzisz postępów",
        ])}
      </div>
    </section>
  );
}

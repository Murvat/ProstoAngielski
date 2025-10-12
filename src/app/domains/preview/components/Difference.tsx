"use client";

import { motion } from "framer-motion";
import { BookOpenCheck, ClipboardCheck, MessageSquareText } from "lucide-react";

export default function DifferencePreview() {
  const cards = [
    {
      title: "Gramatyka",
      icon: BookOpenCheck,
      color: "from-green-400 to-emerald-500",
      items: [
        "Krótkie, zrozumiałe podsumowania lekcji",
        "Konkretne, jasne wyjaśnienia",
        "Praktyczne przykłady z życia codziennego",
        "Bez zbędnej teorii",
        "Skuteczne techniki powtórek",
        "Materiały PDF do pobrania",
      ],
    },
    {
      title: "Ćwiczenia",
      icon: ClipboardCheck,
      color: "from-teal-400 to-green-500",
      items: [
        "Interaktywne ćwiczenia",
        "Zadania dopasowane do poziomu",
        "Ćwiczenia oparte na codziennych sytuacjach",
        "Możliwość śledzenia postępów",
        "Zadania rozwijające wszystkie umiejętności",
        "Nauka w dowolnym miejscu (także na telefonie)",
      ],
    },
    {
      title: "Słownictwo",
      icon: MessageSquareText,
      color: "from-emerald-400 to-teal-500",
      items: [
        "Codzienne słowa i wyrażenia",
        "Idiomy i kolokacje",
        "Konkretny zakres słownictwa w każdej lekcji",
        "Materiały do samodzielnej nauki",
        "Powtórki w systemie zapamiętywania",
        "Łatwy dostęp na urządzeniach mobilnych",
      ],
    },
  ];

  return (
    <section className="relative max-w-screen-xl mx-auto py-24 px-6 flex flex-col gap-16 items-center overflow-hidden">
      {/* 🌈 Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08),_transparent_70%)]"
      />

      {/* 🏷️ Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="font-sans font-extrabold text-3xl md:text-5xl text-center leading-tight bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text"
      >
        Dlaczego warto uczyć się w naszej aplikacji
      </motion.h2>

      {/* 🧩 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              scale: 1.05,
              boxShadow: "0 15px 40px rgba(16,185,129,0.2)",
            }}
            className="relative w-full max-w-sm bg-white/80 border border-gray-200 rounded-3xl p-8 flex flex-col gap-6 shadow-lg backdrop-blur-xl transition-all duration-500 hover:border-green-300"
          >
            {/* Glow Aura */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className={`absolute -inset-[2px] blur-3xl rounded-3xl bg-gradient-to-br ${card.color} opacity-20`}
            />

            {/* Icon & Title */}
            <div className="relative z-10 flex items-center gap-3">
              <div
                className={`p-3 rounded-full bg-gradient-to-br ${card.color} text-white shadow-md`}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {card.title}
              </h3>
            </div>

            {/* List */}
            <ul className="relative z-10 flex flex-col gap-3 mt-2">
              {card.items.map((item) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                  <p className="text-gray-700 text-base leading-relaxed">
                    {item}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

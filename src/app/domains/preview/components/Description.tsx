"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Description() {
  const blocks = [
    {
      img: "/adfree.png",
      title: "Żadnej reklamy.",
      text: "Uczysz się angielskiego, a nie tracisz czasu na reklamy. U nas liczy się Twój rozwój i komfort nauki. Zero banerów, zero rozpraszaczy — tylko to, co naprawdę ważne.",
      reverse: false,
    },
    {
      img: "/pay.png",
      title: "Jednorazowa opłata",
      text: "Płacisz raz i uczysz się bez limitów, kiedy chcesz i jak chcesz. Bez ukrytych opłat, bez subskrypcji. Prosto, uczciwie i przejrzyście — dokładnie tak, jak powinno być.",
      reverse: true,
    },
    {
      img: "/career.png",
      title: "Nauka języka to nie zabawa",
      text: "To jest prawdziwa inwestycja w siebie. Dlatego u nas nie znajdziesz zbędnych gier ani rankingów. Stawiamy na konkretną naukę, która daje realne efekty.",
      reverse: false,
    },
    {
      img: "/speak.png",
      title: "Dla Polaków",
      text: "Kurs stworzony z myślą o Polakach, którzy chcą naprawdę zrozumieć angielski. Tłumaczymy trudne rzeczy prosto, po ludzku — bez zbędnego chaosu.",
      reverse: true,
    },
  ];

  return (
    <section className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 flex flex-col gap-24 overflow-hidden">
      {/* 🌈 Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08),_transparent_70%)]"
      ></motion.div>

      {blocks.map((b, i) => (
        <motion.div
          key={b.title}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true }}
          className={`flex flex-col ${
            b.reverse ? "md:flex-row-reverse" : "md:flex-row"
          } items-center gap-10 md:gap-16 relative z-10`}
        >
          {/* 🌠 Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              rotateY: b.reverse ? -3 : 3,
            }}
            className="relative w-full sm:w-[80%] md:w-1/2 flex justify-center"
          >
            {/* Glow Aura */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className={`absolute inset-0 blur-3xl rounded-3xl ${
                b.reverse
                  ? "bg-gradient-to-tr from-green-200/40 via-emerald-100/30 to-transparent"
                  : "bg-gradient-to-br from-emerald-300/40 via-green-100/30 to-transparent"
              }`}
            ></motion.div>

            <Image
              src={b.img}
              alt={b.title}
              width={600}
              height={400}
              className="relative z-10 w-full h-auto rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] object-cover transition-transform duration-700 ease-out"
            />
          </motion.div>

          {/* 🧠 Text Section */}
          <motion.div
            initial={{ opacity: 0, x: b.reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 flex flex-col gap-5 text-center md:text-left"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text">
              {b.title}
            </h2>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
              {b.text}
            </p>

            {/* Accent Line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-[3px] bg-gradient-to-r from-green-500 to-emerald-300 rounded-full mx-auto md:mx-0 mt-2"
            />
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
}

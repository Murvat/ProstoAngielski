"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, BadgeCheck } from "lucide-react";
import { useCourse } from "../features/useCourse";
import { motion } from "framer-motion";

export default function PricesPreview() {
  const router = useRouter();
  const { courses, loading, error } = useCourse();

  if (loading) {
    return (
      <section className="w-full max-w-screen-xl mx-auto py-12 px-4 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700 text-lg"
        >
          Ładowanie kursów...
        </motion.p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-screen-xl mx-auto py-12 px-4 flex flex-col items-center text-center">
        <p className="text-red-600 text-lg">Błąd: {error}</p>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-screen-xl mx-auto py-24 px-4 flex flex-col items-center text-center gap-16 overflow-hidden">
      {/* 🌈 Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]"
      ></motion.div>

      {/* 💬 Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-2xl flex flex-col gap-4 z-10"
      >
        <h2 className="font-sans font-extrabold text-3xl md:text-5xl leading-tight bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text">
          Jednorazowa, łatwa opłata.
        </h2>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
          Nie lubimy abonamentów. Płacisz raz, masz wszystko.
        </p>
      </motion.div>

      {/* 💳 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full justify-items-center relative z-10">
        {courses.map((c, index) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: index * 0.2,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.06,
              y: -10,
              boxShadow:
                c.id === "intermediate"
                  ? "0 20px 40px rgba(16,185,129,0.3)"
                  : "0 15px 30px rgba(0,0,0,0.1)",
            }}
            className={`relative w-full max-w-sm flex flex-col justify-between rounded-3xl p-8 backdrop-blur-lg transition-all duration-500 border
              ${
                c.id === "intermediate"
                  ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-300"
                  : "bg-white border-gray-200"
              }`}
          >
            {/* 🌟 Halo effect for featured plan */}
            {c.id === "intermediate" && (
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-green-400/40 via-emerald-300/30 to-transparent blur-2xl"
              ></motion.div>
            )}

            {/* 🧾 Plan Details */}
            <div className="relative z-10 flex flex-col items-start gap-5">
              {c.id === "intermediate" && (
                <span className="text-xs uppercase font-bold text-green-700 tracking-wider">
                  🌿 Najpopularniejszy
                </span>
              )}

              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                {c.title}
              </h3>

              <p
                className={`font-extrabold ${
                  c.id === "intermediate"
                    ? "text-4xl text-green-700"
                    : "text-3xl text-gray-800"
                }`}
              >
                {c.price / 100} zł
              </p>

              <ul className="text-sm md:text-base text-gray-700 leading-relaxed flex flex-col gap-3">
                {c.features.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    {c.id === "intermediate" ? (
                      <BadgeCheck className="w-6 h-6 text-green-600 shrink-0 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 🧡 CTA Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(249,115,22,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/signup")}
              className={`mt-8 w-full py-3 rounded-full pointer font-semibold transition-all text-white ${
                c.id === "intermediate"
                  ? "bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Załóż konto
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

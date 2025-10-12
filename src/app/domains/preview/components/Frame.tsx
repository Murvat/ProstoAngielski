"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function FramePreview() {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-green-50 py-16 flex flex-col items-center text-center px-4 md:px-16"
    >
      <h2 className="text-3xl md:text-5xl font-bold leading-tight text-green-800">
        Ucz się angielskiego skutecznie!
      </h2>

      <p className="max-w-xl text-base md:text-lg mt-4 text-gray-700">
        Ucz się angielskiego skutecznie i z pewnością, że idziesz w dobrą
        stronę. Otrzymujesz jasne wyjaśnienia, praktyczne przykłady i konkretne
        rezultaty. Bez rozpraszaczy, bez zbędnych teorii.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/signup")}
        className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-lg"
      >
        Rozpocznij naukę
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full max-w-3xl mt-12 rounded-xl overflow-hidden shadow-2xl"
      >
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          className="w-full aspect-video rounded-t-xl"
          style={{ border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Wideo"
        />
      </motion.div>
    </motion.section>
  );
}

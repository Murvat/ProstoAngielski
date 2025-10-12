"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const slides = [
  { src: "/previewAi.png", alt: "Interaktywne lekcje" },
  { src: "/previewAi2.png", alt: "Śledzenie postępów" },
  { src: "/previewAi3.png", alt: "Aplikacja mobilna już wkrótce" },
];

export default function FeaturesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="relative w-full bg-gradient-to-br from-green-50 via-white to-emerald-100 overflow-hidden py-20">
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]"
      ></motion.div>

      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-12 flex flex-col items-center text-center relative z-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-sans font-extrabold text-3xl md:text-5xl leading-tight tracking-tight bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 bg-clip-text text-transparent"
        >
          Odkryj funkcje aplikacji
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md text-base md:text-lg font-sans text-gray-700 mt-4"
        >
          Wszystko, czego potrzebujesz, aby skutecznie uczyć się języka —
          lekcje, ćwiczenia i postępy w jednym miejscu.
        </motion.p>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mt-12 relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
        >
          {/* Animated glow aura */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-tr from-emerald-200/40 via-green-100/20 to-transparent blur-3xl"
          ></motion.div>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex-[0_0_100%] relative aspect-video select-none"
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    className="object-cover rounded-3xl transition-transform duration-700 ease-out hover:scale-105 hover:rotate-[1deg]"
                  />
                  {/* Overlay Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent text-white text-lg md:text-2xl font-semibold pb-6 backdrop-blur-[1px]"
                  >
                    {s.alt}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{
              scale: 1.15,
              boxShadow: "0 0 20px rgba(16,185,129,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollPrev}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md backdrop-blur-md transition-all"
            aria-label="Poprzedni slajd"
          >
            <ChevronLeft className="w-6 h-6 text-green-700" />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.15,
              boxShadow: "0 0 20px rgba(16,185,129,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md backdrop-blur-md transition-all"
            aria-label="Następny slajd"
          >
            <ChevronRight className="w-6 h-6 text-green-700" />
          </motion.button>
        </motion.div>

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center gap-3 mt-6"
        >
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => scrollTo(i)}
              whileHover={{ scale: 1.2 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "bg-gradient-to-r from-green-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Przejdź do slajdu ${i + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

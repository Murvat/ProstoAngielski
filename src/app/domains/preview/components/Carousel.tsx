"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="w-full bg-green-50">
      <section className="w-full max-w-screen-xl mx-auto px-4 md:px-12 py-8 flex flex-col items-center text-center gap-4">
        <h2 className="font-sans font-semibold text-2xl md:text-4xl leading-tight tracking-tight text-green-800">
          Odkryj funkcje aplikacji
        </h2>

        <p className="max-w-md text-sm md:text-base font-sans leading-relaxed text-gray-700">
          Wszystko, czego potrzebujesz, aby skutecznie uczyć się języka — lekcje,
          ćwiczenia i postępy w jednym miejscu.
        </p>

        {/* 🖼️ Carousel Frame */}
        <div className="w-full max-w-3xl mt-8 rounded-lg overflow-hidden shadow-md bg-white relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((s, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] relative aspect-video select-none"
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ◀▶ Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-white active:scale-95 transition rounded-full p-2 shadow cursor-pointer"
            aria-label="Poprzedni slajd"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-white active:scale-95 transition rounded-full p-2 shadow cursor-pointer"
            aria-label="Następny slajd"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* ⚪ Slide Indicators */}
          <div className="flex justify-center gap-2 mt-3 pb-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  i === selectedIndex
                    ? "bg-green-600 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Przejdź do slajdu ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

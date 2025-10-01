"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/feature1.png", alt: "Interactive lessons" },
  { src: "/feature2.png", alt: "Progress tracking" },
  { src: "/feature3.png", alt: "Mobile app coming soon" },
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
        <h2 className="font-sans font-semibold text-2xl md:text-4xl leading-tight tracking-tight">
          Odkryj funkcje aplikacji
        </h2>

        <p className="max-w-md text-sm md:text-base font-sans leading-relaxed">
          Wszystko, czego potrzebujesz, aby skutecznie uczyć się języka —
          lekcje, ćwiczenia i postępy w jednym miejscu.
        </p>

        {/* Carousel Frame */}
        <div className="w-full max-w-2xl mt-8 rounded-lg overflow-hidden shadow bg-white relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((s, i) => (
                <div key={i} className="flex-[0_0_100%] relative aspect-video">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Prev/Next buttons */}
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-1 mt-2 pb-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === selectedIndex ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

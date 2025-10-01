"use client";

import { useRouter } from "next/navigation";

export default function FramePreview() {
  const router = useRouter();

  return (
    <div className="w-full bg-green-50">
      <section className="w-full max-w-screen-xl mx-auto px-4 md:px-16 py-16 flex flex-col items-center text-center gap-8">
        <h2 className="font-sans font-semibold text-3xl md:text-5xl leading-tight tracking-tight">
          Ucz się angielskiego skutecznie!
        </h2>

        <p className="max-w-xl text-base md:text-lg font-sans leading-relaxed">
          Ucz się angielskiego skutecznie i z pewnością, że idziesz w dobrą
          stronę. Otrzymujesz jasne wyjaśnienia, praktyczne przykłady i
          konkretne rezultaty. Bez rozpraszaczy, bez zbędnych teorii.
        </p>

        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors"
        >
          Rozpocznij naukę
        </button>

        {/* Responsive Iframe */}
        <div className="w-full max-w-3xl mt-16 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            className="w-full aspect-video rounded-t-xl"
            style={{ border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Wideo"
          />
        </div>
      </section>
    </div>
  );
}

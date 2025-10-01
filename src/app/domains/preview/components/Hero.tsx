"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-12 shadow">
      {/* Image */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/hero3.png"
          alt="hero"
          width={600}
          height={300}
          className="w-full max-w-lg h-auto rounded-3xl"
          priority
        />
      </div>

      {/* Text + Buttons */}
      <div className="flex-1 flex flex-col items-center gap-6 text-center">
        <p className="text-2xl md:text-4xl font-semibold font-sans leading-snug">
          Ucz się angielskiego skutecznie i bez stresu — specjalnie dla Polaków!
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => router.push("/signup")}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors"
          >
            Załóż konto
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 border border-green-700 text-green-700 font-semibold rounded-md hover:bg-green-100 transition-colors"
          >
            Zaloguj się
          </button>
        </div>
      </div>
    </section>
  );
}

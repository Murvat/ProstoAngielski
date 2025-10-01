"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto py-16 px-4 flex flex-col items-center text-center gap-8">
        <h2 className="font-sans font-semibold text-3xl md:text-4xl leading-tight">
          Ucz się angielskiego skutecznie
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          Ucz się razem z tysiącami Polaków
        </p>

        <button
          onClick={() => router.push("/signup")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Załóż konto
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-screen-xl mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex gap-6">
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>

        <div className="text-gray-500">&copy; 2025</div>
      </div>
    </footer>
  );
}

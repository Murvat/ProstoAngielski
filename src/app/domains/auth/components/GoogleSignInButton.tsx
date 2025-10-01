"use client";

import Image from "next/image";

export default function GoogleSignInButton() {
function handleGoogleLogin() {
    window.location.href = "/api/auth/google"; // ✅ go to server route
  }
  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg shadow-sm hover:bg-gray-100 active:scale-95 transition w-full justify-center"
    >
      <Image
        src="/googleIcon.png"
        alt="Google logo"
        width={20}
        height={20}
        className="w-5 h-5"
      />
      <span className="font-medium">Zaloguj się przez Google</span>
    </button>
  );
}

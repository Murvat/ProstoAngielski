"use client";

import Image from "next/image";

export default function GoogleSignInButton() {
  function handleGoogleLogin() {
    window.location.href = "/api/auth/google"; // ✅ go to server route
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 
      px-6 py-3 rounded-lg shadow-sm w-full justify-center 
      hover:bg-gray-100 hover:border-green-400 active:scale-95 active:bg-gray-200 
      transition-all duration-200 cursor-pointer"
    >
      <Image
        src="/googleIcon.png"
        alt="Logo Google"
        width={20}
        height={20}
        className="w-5 h-5"
      />
      <span className="font-medium">Zaloguj się przez Google</span>
    </button>
  );
}

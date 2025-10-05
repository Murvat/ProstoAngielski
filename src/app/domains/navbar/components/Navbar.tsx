"use client";

import Image from "next/image";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import type { User } from "@supabase/supabase-js";
import { RefObject, useState } from "react";

type NavbarProps = {
  user: User | null;
  isOpen: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  onGoProfile: () => void;
  onGoContact: () => void;
  onGoPayments: () => void;
  onLogout: () => void;
  onLogin: () => void;
};

export default function Navbar({
  user,
  isOpen,
  onToggleDropdown,
  dropdownRef,
  onGoProfile,
  onGoContact,
  onGoPayments,
  onLogout,
  onLogin,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* 🟩 Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <Image
          src="/logoweb.svg"
          alt="Logo Prosto Angielski"
          width={50}
          height={50}
          className="hover:scale-105 transition-transform"
        />
        <h1 className="text-lg font-bold text-green-600 hidden sm:block">
          PROSTOANGIELSKI
        </h1>
      </div>

      {/* 💻 Desktop menu */}
      <div
        className="hidden md:flex items-center gap-4 relative"
        ref={dropdownRef}
      >
        {user ? (
          <>
            <button
              onClick={onToggleDropdown}
              className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
            >
              Menu ▾
            </button>

            {isOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg animate-fadeIn">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={onGoProfile}
                  >
                    Kursy
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={onGoContact}
                  >
                    Kontakt
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={onGoPayments}
                  >
                    Płatności
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-colors"
                    onClick={onLogout}
                  >
                    <FiLogOut /> Wyloguj się
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-700">Masz już konto?</p>
            <button
              onClick={onLogin}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-100 active:bg-green-200 transition-colors cursor-pointer"
            >
              Zaloguj się
            </button>
          </div>
        )}
      </div>

      {/* 📱 Mobile hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* 📋 Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden animate-fadeIn">
          <ul className="flex flex-col p-4 gap-4 text-gray-700">
            {user ? (
              <>
                <li
                  className="cursor-pointer hover:text-green-700 transition-colors"
                  onClick={() => {
                    onGoProfile();
                    setMobileOpen(false);
                  }}
                >
                  Kursy
                </li>
                <li
                  className="cursor-pointer hover:text-green-700 transition-colors"
                  onClick={() => {
                    onGoContact();
                    setMobileOpen(false);
                  }}
                >
                  Kontakt
                </li>
                <li
                  className="cursor-pointer hover:text-green-700 transition-colors"
                  onClick={() => {
                    onGoPayments();
                    setMobileOpen(false);
                  }}
                >
                  Płatności
                </li>
                <li
                  className="cursor-pointer flex items-center gap-2 hover:text-red-600 transition-colors"
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                >
                  <FiLogOut /> Wyloguj się
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    onLogin();
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-100 active:bg-green-200 transition-colors"
                >
                  Zaloguj się
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

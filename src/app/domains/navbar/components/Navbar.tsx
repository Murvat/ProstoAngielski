"use client";

import Image from "next/image";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import type { User } from "@supabase/supabase-js";
import { RefObject, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  onCloseDropdown,
  dropdownRef,
  onGoProfile,
  onGoContact,
  onGoPayments,
  onLogout,
  onLogin,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navbar blur on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-lg bg-white/80 shadow-lg border-b border-green-100"
          : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 🟩 Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
          onClick={onGoProfile}
        >
          <Image
            src="/logoweb.svg"
            alt="Logo Prosto Angielski"
            width={45}
            height={45}
            className="rounded-md"
          />
          <h1 className="text-lg font-extrabold text-green-700 hidden sm:block tracking-tight">
            PROSTOANGIELSKI
          </h1>
        </div>

        {/* 💻 Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 relative" ref={dropdownRef}>
          {user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleDropdown}
                className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-md hover:bg-green-100 transition-all"
              >
                Menu ▾
              </motion.button>

              {/* 🔽 Dropdown */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-48 bg-white/90 border border-gray-200 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden"
                  >
                    <ul className="flex flex-col py-2">
                      <li
                        onClick={() => {
                          onGoProfile();
                          onCloseDropdown();
                        }}
                        className="px-4 py-2 hover:bg-green-50 text-gray-800 cursor-pointer transition-colors"
                      >
                        Kursy
                      </li>
                      <li
                        onClick={() => {
                          onGoContact();
                          onCloseDropdown();
                        }}
                        className="px-4 py-2 hover:bg-green-50 text-gray-800 cursor-pointer transition-colors"
                      >
                        Kontakt
                      </li>
                      <li
                        onClick={() => {
                          onGoPayments();
                          onCloseDropdown();
                        }}
                        className="px-4 py-2 hover:bg-green-50 text-gray-800 cursor-pointer transition-colors"
                      >
                        Płatności
                      </li>
                      <li
                        onClick={() => {
                          onLogout();
                          onCloseDropdown();
                        }}
                        className="px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <FiLogOut /> Wyloguj się
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-700">Masz już konto?</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogin}
                className="px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-100 transition-all"
              >
                Zaloguj się
              </motion.button>
            </div>
          )}
        </div>

        {/* 📱 Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-md bg-green-50 hover:bg-green-100 transition-colors"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* 📋 Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-xl"
          >
            <ul className="flex flex-col p-4 gap-4 text-gray-800 font-medium">
              {user ? (
                <>
                  <li
                    onClick={() => {
                      onGoProfile();
                      setMobileOpen(false);
                    }}
                    className="hover:text-green-700 transition-colors cursor-pointer"
                  >
                    Kursy
                  </li>
                  <li
                    onClick={() => {
                      onGoContact();
                      setMobileOpen(false);
                    }}
                    className="hover:text-green-700 transition-colors cursor-pointer"
                  >
                    Kontakt
                  </li>
                  <li
                    onClick={() => {
                      onGoPayments();
                      setMobileOpen(false);
                    }}
                    className="hover:text-green-700 transition-colors cursor-pointer"
                  >
                    Płatności
                  </li>
                  <li
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <FiLogOut /> Wyloguj się
                  </li>
                </>
              ) : (
                <li>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onLogin();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-100 transition-all"
                  >
                    Zaloguj się
                  </motion.button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

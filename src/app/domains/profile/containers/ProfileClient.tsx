"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useBuyCourse } from "../features/useBuyCourse";
import { useCourseProgress } from "../features/useCourseProgress";
import { ProfileTabs } from "../components/ProfileTabs";
import { ProfileCoursesOwned } from "../components/ProfileCoursesOwned";
import { ProfileCoursesNew } from "../components/ProfileCoursesNew";
import { ProfileUserData } from "../components/ProfileUserData";
import { ProfileSettings } from "../components/ProfileSettings";
import { ProfilePayments } from "../components/ProfilePayments";
import { ProfileMobileApp } from "../components/ProfileMobileApp";
import { Course, Purchase, Progress, User, Tab, Subscription } from "../features/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState<Tab>("kursy");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    user: User | null;
    allCourses: Course[];
    purchases: Purchase[];
    progress: Progress[];
    subscriptions: Subscription[];
  }>({
    user: null,
    allCourses: [],
    purchases: [],
    progress: [],
    subscriptions: [],
  });

  const { loading: buyLoading } = useBuyCourse();
  const { getButtonState } = useCourseProgress(data.progress ?? []);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        console.error("❌ Profile fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const ownedCourses = useMemo(() => {
    const { allCourses, purchases } = data;
    return allCourses.filter((c) =>
      purchases.some((p) => p.course === c.id && p.payment_status === "paid")
    );
  }, [data.allCourses, data.purchases]);

  const newCourses = useMemo(() => {
    const { allCourses, purchases } = data;
    return allCourses.filter(
      (c) => !purchases.some((p) => p.course === c.id && p.payment_status === "paid")
    );
  }, [data.allCourses, data.purchases]);

  const handleTabChange = useCallback((tab: Tab) => setActiveTab(tab), []);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600">Ładowanie profilu...</p>
      </div>
    );

  if (!data.user)
    return (
      <div className="text-center mt-8 text-red-600 font-medium">
        Nie udało się pobrać danych użytkownika.
      </div>
    );

  const { user, allCourses, purchases, subscriptions } = data;

  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">
      {/* 🟩 Header with logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center md:justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
       
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-500 text-transparent bg-clip-text">
            Mój Profil
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          Witaj, <span className="font-semibold">{user.email}</span>
        </p>
      </motion.div>

      {/* Tabs */}
      <ProfileTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* 🧭 Content area */}
      <motion.div
        layout
        className="bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-lg p-6 transition-all"
      >
        <AnimatePresence mode="wait">
          {activeTab === "kursy" && (
            <motion.div
              key="kursy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <section>
                <h2 className="text-lg font-semibold mb-4 text-green-700">
                  Moje kursy
                </h2>
                <ProfileCoursesOwned
                  ownedCourses={ownedCourses}
                  loading={buyLoading}
                  getButtonState={getButtonState}
                />
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-4 text-green-700">
                  Nowe kursy
                </h2>
                <ProfileCoursesNew
                  newCourses={newCourses}
                  purchases={purchases}
                  loading={buyLoading}
                />
              </section>
            </motion.div>
          )}

          {activeTab === "dane" && (
            <motion.div
              key="dane"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileUserData id={user.id} email={user.email} />
            </motion.div>
          )}

          {activeTab === "ustalenia" && (
            <motion.div
              key="ustalenia"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileSettings />
            </motion.div>
          )}

          {activeTab === "platnosci" && (
            <motion.div
              key="platnosci"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ProfilePayments
                subscriptions={subscriptions}
                allCourses={allCourses}
                purchases={purchases}
              />
            </motion.div>
          )}

          {activeTab === "mobilna" && (
            <motion.div
              key="mobilna"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileMobileApp />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

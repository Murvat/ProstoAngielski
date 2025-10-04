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

export default function ProfileClient() {
  // 1️⃣ All states declared unconditionally
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

  // 2️⃣ Hooks always run (never conditionally)
  const { loading: buyLoading } = useBuyCourse();
  const { getButtonState } = useCourseProgress(data.progress ?? []);

  // 3️⃣ Fetch once
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

  // 4️⃣ Derived data (safe defaults)
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

  // 5️⃣ Render
  if (loading) return <p className="text-center mt-8">Ładowanie profilu...</p>;
  if (!data.user) return <p className="text-center mt-8">Nie udało się pobrać danych.</p>;

  const { user, allCourses, purchases, subscriptions } = data;

  return (
    <div className="mt-8">
      <ProfileTabs activeTab={activeTab} onChange={handleTabChange} />
      <div className="bg-white shadow rounded-xl p-6">
        {activeTab === "kursy" && (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold mb-4">Moje kursy</h2>
              <ProfileCoursesOwned
                ownedCourses={ownedCourses}
                loading={buyLoading}
                getButtonState={getButtonState}
              />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Nowe kursy</h2>
              <ProfileCoursesNew
                newCourses={newCourses}
                purchases={purchases}
                loading={buyLoading}
              />
            </section>
          </div>
        )}

        {activeTab === "dane" && <ProfileUserData id={user.id} email={user.email} />}
        {activeTab === "ustalenia" && <ProfileSettings />}
        {activeTab === "platnosci" && (
          <ProfilePayments
            subscriptions={subscriptions}
            allCourses={allCourses}
            purchases={purchases}
          />
        )}
        {activeTab === "mobilna" && <ProfileMobileApp />}
      </div>
    </div>
  );
}

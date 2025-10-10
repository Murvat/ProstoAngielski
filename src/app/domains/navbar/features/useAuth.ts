// src/app/domains/auth/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (isMounted) {
        setUser(data.user ?? null);
        setLoading(false);
      }
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // Clear localStorage
    localStorage.clear();
    // Clear sessionStorage as well for complete cleanup
    sessionStorage.clear();
    window.location.href = "/"; // redirect to home after logout
  }

  return { user, loading, logout };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMobileLevels } from "@/lib/supabase/queries/mobileLevels";
import type { MobileLevel } from "@/types";

type FetchState = {
  loading: boolean;
  error: string | null;
  levels: MobileLevel[];
};

export function usePracticeLevels() {
  const [{ loading, error, levels }, setState] = useState<FetchState>({
    loading: true,
    error: null,
    levels: [],
  });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const data = await fetchMobileLevels();
        if (!active) return;
        const sorted = [...data].sort((a, b) => a.level.localeCompare(b.level));
        setState({ loading: false, error: null, levels: sorted });
      } catch (err) {
        if (!active) return;
        console.error("[Practices] loading levels failed", err);
        setState({
          loading: false,
          error: "Nie udało się pobrać poziomów. Spróbuj ponownie później.",
          levels: [],
        });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const defaultLevel = useMemo(() => {
    return levels.length > 0 ? levels[0] : null;
  }, [levels]);

  return {
    loading,
    error,
    levels,
    defaultLevel,
  };
}

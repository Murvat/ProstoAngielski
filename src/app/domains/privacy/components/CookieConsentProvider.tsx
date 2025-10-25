"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ConsentSelection = "accepted" | "rejected" | "unknown";

type StoredConsent = {
  status: Exclude<ConsentSelection, "unknown">;
  timestamp: number;
};

type CookieConsentContextValue = {
  status: ConsentSelection;
  accept: () => void;
  reject: () => void;
};

const STORAGE_KEY = "prosto-angielski-cookie-consent";
const CONSENT_TTL = 1000 * 60 * 60 * 24 * 180; // 180 days in ms
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA_REMOTE_SCRIPT_ID = GA_MEASUREMENT_ID
  ? `ga-remote-${GA_MEASUREMENT_ID}`
  : "ga-remote";
const GA_INLINE_SCRIPT_ID = GA_MEASUREMENT_ID
  ? `ga-inline-${GA_MEASUREMENT_ID}`
  : "ga-inline";

type ExtendedWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: string]: unknown;
};

function removeAnalyticsArtifacts() {
  if (typeof document === "undefined") return;

  const remoteScript = document.getElementById(GA_REMOTE_SCRIPT_ID);
  if (remoteScript?.parentNode) {
    remoteScript.parentNode.removeChild(remoteScript);
  }

  const inlineScript = document.getElementById(GA_INLINE_SCRIPT_ID);
  if (inlineScript?.parentNode) {
    inlineScript.parentNode.removeChild(inlineScript);
  }
}

function initialiseGoogleAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!GA_MEASUREMENT_ID) {
    console.warn(
      "[CookieConsent] NEXT_PUBLIC_GA_MEASUREMENT_ID is missing; analytics skipped."
    );
    return;
  }

  const disableFlag = `ga-disable-${GA_MEASUREMENT_ID}`;
  const extendedWindow = window as unknown as ExtendedWindow;
  extendedWindow[disableFlag] = false;

  if (!document.getElementById(GA_REMOTE_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_REMOTE_SCRIPT_ID;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.dataset.analytics = "google";
    document.head.appendChild(script);
  }

  if (!document.getElementById(GA_INLINE_SCRIPT_ID)) {
    const inlineScript = document.createElement("script");
    inlineScript.id = GA_INLINE_SCRIPT_ID;
    inlineScript.type = "text/javascript";
    inlineScript.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true,  debug_mode: true
 });
    `;
    document.head.appendChild(inlineScript);
  } else if (typeof extendedWindow.gtag === "function") {
    extendedWindow.gtag("consent", "update", { analytics_storage: "granted" });
  }
}

function disableGoogleAnalytics(status: ConsentSelection) {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;

  const disableFlag = `ga-disable-${GA_MEASUREMENT_ID}`;
  const extendedWindow = window as unknown as ExtendedWindow;
  extendedWindow[disableFlag] = true;
  removeAnalyticsArtifacts();

  if (status === "unknown" && typeof extendedWindow.gtag === "function") {
    extendedWindow.gtag("consent", "update", { analytics_storage: "denied" });
  }
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(
  undefined
);

function readStoredConsent(): ConsentSelection {
  if (typeof window === "undefined") return "unknown";

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "unknown";

    const parsed = JSON.parse(raw) as StoredConsent | null;
    if (!parsed?.status || !parsed.timestamp) return "unknown";

    const expired = Date.now() - parsed.timestamp > CONSENT_TTL;
    return expired ? "unknown" : parsed.status;
  } catch (error) {
    console.warn("Failed to parse stored cookie consent:", error);
    return "unknown";
  }
}

function persistConsent(status: Exclude<ConsentSelection, "unknown">) {
  if (typeof window === "undefined") return;

  const payload: StoredConsent = {
    status,
    timestamp: Date.now(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to persist cookie consent:", error);
  }
}

function eraseConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to remove cookie consent:", error);
  }
}

function AnalyticsManager({ status }: { status: ConsentSelection }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (status === "accepted") {
      initialiseGoogleAnalytics();
      console.info("[CookieConsent] Google Analytics initialised after consent.");
    } else if (status === "rejected") {
      disableGoogleAnalytics(status);
      console.info("[CookieConsent] Analytics disabled due to rejection.");
    } else {
      disableGoogleAnalytics(status);
      console.info("[CookieConsent] Awaiting user decision before analytics.");
    }
  }, [status]);

  return null;
}

function CookieBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
}) {
  if (typeof document === "undefined") return null;

  const banner = (
    <div
      role="region"
      aria-label="Ustawienia prywatnosci i cookies"
      className="fixed inset-x-0 bottom-0 z-[9999] border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-4 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">
            Szanujemy Twoja prywatnosc
          </p>
          <p className="text-xs leading-relaxed text-gray-600">
            Uzywamy cookies, aby analizowac ruch, dostosowywac tresci oraz
            chroniac Twoje dane zgodnie z RODO. Wybierz, czy zgadzasz sie na
            przechowywanie cookies analitycznych. Mozesz zmienic decyzje w
            dowolnym momencie.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <button
            type="button"
            onClick={onReject}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Odrzuc
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Akceptuj
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(banner, document.body);
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }

  return context;
}

export default function CookieConsentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<ConsentSelection>("unknown");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedStatus = readStoredConsent();
    setStatus(storedStatus);
    setHydrated(true);
  }, []);

  const handleAccept = useCallback(() => {
    persistConsent("accepted");
    setStatus("accepted");
  }, []);

  const handleReject = useCallback(() => {
    persistConsent("rejected");
    setStatus("rejected");
  }, []);

  const contextValue = useMemo(
    () => ({
      status,
      accept: handleAccept,
      reject: handleReject,
    }),
    [handleAccept, handleReject, status]
  );

  useEffect(() => {
    if (status === "unknown") return;

    // Optional safeguard in case localStorage was manually cleared.
    if (status === readStoredConsent()) return;
    if (status === "accepted" || status === "rejected") {
      persistConsent(status);
    } else {
      eraseConsent();
    }
  }, [status]);

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
      <AnalyticsManager status={status} />
      {hydrated && status === "unknown" && (
        <CookieBanner onAccept={handleAccept} onReject={handleReject} />
      )}
    </CookieConsentContext.Provider>
  );
}

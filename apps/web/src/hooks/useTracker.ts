"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    // Prevent double tracking of the exact same path/query during React StrictMode double rendering
    if (lastTrackedPath.current === currentPath) return;
    lastTrackedPath.current = currentPath;

    const trackSession = async () => {
      const utmSource = searchParams.get("utm_source") || undefined;
      const utmMedium = searchParams.get("utm_medium") || undefined;
      const utmCampaign = searchParams.get("utm_campaign") || undefined;
      const utmContent = searchParams.get("utm_content") || undefined;
      const gclid = searchParams.get("gclid") || undefined;
      const fbclid = searchParams.get("fbclid") || undefined;
      
      const referrer = document.referrer || undefined;
      const landingPage = window.location.origin + pathname;

      try {
        await fetch("/api/tracking/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            utmSource,
            utmMedium,
            utmCampaign,
            utmContent,
            gclid,
            fbclid,
            referrer,
            landingPage,
          }),
        });
      } catch (err) {
        console.error("Attribution tracking failed:", err);
      }
    };

    trackSession();
  }, [pathname, searchParams]);
}

type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

const META_PIXEL_IDS =
  process.env.NEXT_PUBLIC_META_PIXEL_IDS
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean) ?? [];

function sendMetaFallback(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (META_PIXEL_IDS.length === 0) return;

  META_PIXEL_IDS.forEach((pixelId) => {
    const url = new URL("https://www.facebook.com/tr");

    url.searchParams.set("id", pixelId);
    url.searchParams.set("ev", eventName);
    url.searchParams.set("dl", window.location.href);
    url.searchParams.set("rl", document.referrer || "");
    url.searchParams.set("if", "false");
    url.searchParams.set("ts", Date.now().toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(`cd[${key}]`, String(value));
      }
    });

    const img = new Image();
    img.src = url.toString();
  });
}

export function track(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  console.log("Tracking event:", eventName, params);

  // Google Analytics
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  // Meta custom event
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, params);
  }

  // Backup direct Meta request
  sendMetaFallback(eventName, params);
}

export function trackMeta(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  console.log("Tracking Meta standard event:", eventName, params);

  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  }

  sendMetaFallback(eventName, params);
}

export function trackMetaCustom(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  console.log("Tracking Meta custom event:", eventName, params);

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, params);
  }

  sendMetaFallback(eventName, params);
}
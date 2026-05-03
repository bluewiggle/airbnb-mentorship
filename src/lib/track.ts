type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, params);
  }
}

export function trackMeta(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}

export function trackMetaCustom(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, params);
  }
}

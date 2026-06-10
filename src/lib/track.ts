type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    __BNB_ATTRIBUTION__?: {
      ref: "n" | "l";
      referrer: "Noah" | "Liam";
      pixel_id: string;
      fbclid?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
      utm_term?: string;
      landing_page?: string;
      first_seen_at?: string;
      last_seen_at?: string;
    } | null;
  }
}

const STORAGE_KEY = "bnb_attribution";

function safeJsonParse(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getAttribution() {
  if (typeof window === "undefined") return null;

  if (window.__BNB_ATTRIBUTION__) {
    return window.__BNB_ATTRIBUTION__;
  }

  const stored =
    safeJsonParse(localStorage.getItem(STORAGE_KEY)) ||
    safeJsonParse(getCookie(STORAGE_KEY));

  if (stored?.ref && stored?.pixel_id) {
    window.__BNB_ATTRIBUTION__ = stored;
    return stored;
  }

  return null;
}

export function getAttributionReferrer() {
  const attribution = getAttribution();

  return attribution?.referrer || "Unassigned";
}

function cleanParams(params: EventParams = {}): EventParams {
  const attribution = getAttribution();

  return {
    ...params,
    ref: attribution?.ref || "unassigned",
    referrer: attribution?.referrer || "Unassigned",
    fbclid: attribution?.fbclid || undefined,
    utm_source: attribution?.utm_source || undefined,
    utm_medium: attribution?.utm_medium || undefined,
    utm_campaign: attribution?.utm_campaign || undefined,
    utm_content: attribution?.utm_content || undefined,
    utm_term: attribution?.utm_term || undefined,
  };
}

export function track(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const cleaned = cleanParams(params);

  console.log("Tracking event:", eventName, cleaned);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, cleaned);
  }

  const attribution = getAttribution();

  if (!attribution?.pixel_id) {
    console.log("Meta custom event skipped because no attribution ref exists.");
    return;
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackSingleCustom", attribution.pixel_id, eventName, cleaned);
  }
}

export function trackMeta(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const attribution = getAttribution();
  const cleaned = cleanParams(params);
  const eventId =
    typeof cleaned.event_id === "string"
      ? cleaned.event_id
      : typeof cleaned.meta_event_id === "string"
        ? cleaned.meta_event_id
        : undefined;

  console.log("Tracking Meta standard event:", eventName, cleaned);

  if (!attribution?.pixel_id) {
    console.log("Meta standard event skipped because no attribution ref exists.");
    return;
  }

  if (typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("trackSingle", attribution.pixel_id, eventName, cleaned, {
        eventID: eventId,
      });
      return;
    }

    window.fbq("trackSingle", attribution.pixel_id, eventName, cleaned);
  }
}

export function trackMetaCustom(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const attribution = getAttribution();
  const cleaned = cleanParams(params);

  console.log("Tracking Meta custom event:", eventName, cleaned);

  if (!attribution?.pixel_id) {
    console.log("Meta custom event skipped because no attribution ref exists.");
    return;
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackSingleCustom", attribution.pixel_id, eventName, cleaned);
  }
}
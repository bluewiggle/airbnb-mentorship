import crypto from "crypto";

type MetaEventInput = {
  pixelId: string;
  eventName: "Lead" | "Schedule";
  eventSourceUrl?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  eventId?: string;
  fbp?: string | null;
  fbc?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  customData?: Record<string, any>;
};

const NOAH_PIXEL_ID = "1788895448752082";
const LIAM_PIXEL_ID = "2097284224148333";

function hash(value?: string) {
  if (!value) return undefined;

  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function cleanPhone(value?: string) {
  if (!value) return undefined;
  return value.replace(/[^\d]/g, "");
}

function removeUndefined<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function getAccessToken(pixelId: string) {
  if (pixelId === NOAH_PIXEL_ID) {
    return process.env.NOAH_META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
  }

  if (pixelId === LIAM_PIXEL_ID) {
    return process.env.LIAM_META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
  }

  return process.env.META_ACCESS_TOKEN;
}

export async function sendMetaCapiEvent({
  pixelId,
  eventName,
  eventSourceUrl,
  email,
  phone,
  firstName,
  eventId,
  fbp,
  fbc,
  clientIpAddress,
  clientUserAgent,
  customData = {},
}: MetaEventInput) {
  const accessToken = getAccessToken(pixelId);
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!accessToken) {
    console.warn("Meta CAPI skipped: missing access token.");
    return;
  }

  if (!pixelId) {
    console.warn("Meta CAPI skipped: missing pixel ID.");
    return;
  }

  const payload: any = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl || "https://www.bnblab.com.au/",
        user_data: removeUndefined({
          em: hash(email),
          ph: hash(cleanPhone(phone)),
          fn: hash(firstName),
          fbp,
          fbc,
          client_ip_address: clientIpAddress,
          client_user_agent: clientUserAgent,
        }),
        custom_data: removeUndefined(customData),
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const text = await res.text();

  if (!res.ok) {
    console.error("Meta CAPI failed:", eventName, pixelId, text);
    return;
  }

  console.log("Meta CAPI sent:", eventName, pixelId, text);
}

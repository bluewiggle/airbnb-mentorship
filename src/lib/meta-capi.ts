import crypto from "crypto";

const LIAM_PIXEL_ID = "2097284224148333";

const ALLOWED_PIXEL_IDS = new Set([LIAM_PIXEL_ID]);

export function isAllowedMetaPixelId(pixelId?: string | null) {
  return Boolean(pixelId && ALLOWED_PIXEL_IDS.has(pixelId));
}

type MetaEventInput = {
  pixelId: string;
  eventName: "Lead" | "Schedule";
  eventSourceUrl?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  eventId?: string;
  fbp?: string | null;
  fbc?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  customData?: Record<string, any>;
};

function hash(value?: string | null) {
  if (!value) return undefined;

  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function cleanPhone(value?: string | null) {
  if (!value) return undefined;
  return value.replace(/[^\d]/g, "");
}

function getAccessToken(pixelId: string) {
  if (!isAllowedMetaPixelId(pixelId)) {
    return undefined;
  }

  if (pixelId === LIAM_PIXEL_ID) {
    return process.env.LIAM_META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
  }

  return undefined;
}

export async function sendMetaCapiEvent({
  pixelId,
  eventName,
  eventSourceUrl,
  email,
  phone,
  firstName,
  lastName,
  eventId,
  fbp,
  fbc,
  clientIpAddress,
  clientUserAgent,
  customData = {},
}: MetaEventInput) {
  if (!pixelId) {
    console.warn("Meta CAPI skipped: missing pixel ID.", { eventName });
    return { ok: false, skipped: true, reason: "missing_pixel_id" };
  }

  if (!isAllowedMetaPixelId(pixelId)) {
    console.warn("Meta CAPI skipped: pixel ID is not allow-listed.", {
      pixelId,
      eventName,
    });
    return { ok: false, skipped: true, reason: "pixel_not_allowed" };
  }

  const accessToken = getAccessToken(pixelId);
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!accessToken) {
    console.warn("Meta CAPI skipped: missing access token.", { pixelId, eventName });
    return { ok: false, skipped: true, reason: "missing_access_token" };
  }

  const userData: Record<string, any> = {
    em: hash(email),
    ph: hash(cleanPhone(phone)),
    fn: hash(firstName),
    ln: hash(lastName),
    fbp: fbp || undefined,
    fbc: fbc || undefined,
    client_ip_address: clientIpAddress || undefined,
    client_user_agent: clientUserAgent || undefined,
  };

  Object.keys(userData).forEach((key) => {
    if (!userData[key]) delete userData[key];
  });

  const payload: Record<string, any> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl || "https://www.bnblab.com.au/",
        user_data: userData,
        custom_data: customData,
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
    console.error("Meta CAPI failed:", { pixelId, eventName, status: res.status, text });
    return { ok: false, status: res.status, text };
  }

  console.log(`Meta CAPI sent: ${eventName} ${pixelId}`, text);
  return { ok: true, status: res.status, text };
}

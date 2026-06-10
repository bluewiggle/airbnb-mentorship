import { NextRequest, NextResponse } from "next/server";
import { isAllowedMetaPixelId, sendMetaCapiEvent } from "@/lib/meta-capi";
import { rateLimit } from "@/lib/rate-limit";
import { clean, isInternalRequest } from "@/lib/security";

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getCookie(req: NextRequest, name: string) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.INTERNAL_API_SECRET) {
      console.error("Missing INTERNAL_API_SECRET.");

      return NextResponse.json(
        { ok: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    if (!isInternalRequest(req)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const ip = getClientIp(req);
    const limited = rateLimit(`meta-schedule:ip:${ip}`, {
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    if (!limited.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const pixelId = clean(body.attribution_pixel_id, 40);
    const attributionRef = clean(body.attribution_ref, 20);
    const email = clean(body.email, 120).toLowerCase();
    const phone = clean(body.phone, 40);
    const name = clean(body.name, 100);
    const landingPage = clean(body.landing_page, 500) || "https://www.bnblab.com.au/";

    if (!pixelId || !attributionRef) {
      console.log("Schedule CAPI skipped: no paid attribution exists.", {
        pixelId,
        attributionRef,
      });

      return NextResponse.json({ ok: true, skipped: true, reason: "no_paid_attribution" });
    }

    if (!isAllowedMetaPixelId(pixelId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid attribution data." },
        { status: 400 }
      );
    }

    if (!email) {
      console.warn("Schedule CAPI skipped: missing email.");

      return NextResponse.json(
        { ok: false, error: "Missing email." },
        { status: 400 }
      );
    }

    const eventId =
      clean(body.schedule_event_id, 160) ||
      `schedule_${email}_${Date.now()}`;

    await sendMetaCapiEvent({
      pixelId,
      eventName: "Schedule",
      eventSourceUrl: landingPage,
      email,
      phone,
      firstName: name.split(" ")[0],
      eventId,
      fbp: getCookie(req, "_fbp"),
      fbc: getCookie(req, "_fbc"),
      clientIpAddress: ip === "unknown" ? null : ip,
      clientUserAgent: req.headers.get("user-agent"),
      customData: {
        content_name: "BNB Lab Booked Call",
        referrer: clean(body.referrer, 80),
        attribution_ref: attributionRef,
        calendly_event_uri: clean(body.calendly_event_uri, 500),
        calendly_invitee_uri: clean(body.calendly_invitee_uri, 500),
        utm_source: clean(body.utm_source, 120),
        utm_medium: clean(body.utm_medium, 120),
        utm_campaign: clean(body.utm_campaign, 200),
        utm_content: clean(body.utm_content, 200),
        utm_term: clean(body.utm_term, 200),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Schedule CAPI route failed:", error);

    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}

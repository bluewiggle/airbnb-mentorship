import { NextResponse } from "next/server";
import { isAllowedMetaPixelId, sendMetaCapiEvent } from "@/lib/meta-capi";
import { rateLimit } from "@/lib/rate-limit";
import { clean } from "@/lib/security";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getCookie(req: Request, name: string) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipLimit = rateLimit(`apply:ip:${ip}`, {
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again soon." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const payload = {
      name: clean(body.name, 80),
      email: clean(body.email, 120).toLowerCase(),
      phone: clean(body.phone, 40),
      instagram: clean(body.instagram, 60),
      state: clean(body.state, 80),
      capital: clean(body.capital, 60),
      ready_to_start: clean(body.ready_to_start, 60),
      referrer: clean(body.referrer, 80) || "Unassigned",
      attribution_ref: clean(body.attribution_ref, 20),
      attribution_pixel_id: clean(body.attribution_pixel_id, 40),
      fbclid: clean(body.fbclid, 200),
      utm_source: clean(body.utm_source, 120),
      utm_medium: clean(body.utm_medium, 120),
      utm_campaign: clean(body.utm_campaign, 200),
      utm_content: clean(body.utm_content, 200),
      utm_term: clean(body.utm_term, 200),
      landing_page: clean(body.landing_page, 500),
      meta_event_id: clean(body.meta_event_id, 160),
      status: clean(body.status, 80) || "application_submitted",
    };

    if (!payload.name || !payload.email || !payload.phone) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    const emailLimit = rateLimit(`apply:email:${payload.email}`, {
      limit: 3,
      windowMs: 10 * 60 * 1000,
    });

    if (!emailLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again soon." },
        { status: 429 }
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (
      payload.attribution_pixel_id &&
      !isAllowedMetaPixelId(payload.attribution_pixel_id)
    ) {
      console.warn("Rejected application with invalid attribution_pixel_id.", {
        ip,
        attribution_pixel_id: payload.attribution_pixel_id,
      });

      return NextResponse.json(
        { ok: false, error: "Invalid attribution data." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");

      return NextResponse.json(
        { ok: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/applications`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!insertRes.ok) {
      const text = await insertRes.text();
      console.error("Supabase insert failed:", text);

      return NextResponse.json(
        { ok: false, error: "Could not save application. Please try again." },
        { status: 500 }
      );
    }

    if (payload.attribution_pixel_id && payload.attribution_ref) {
      await sendMetaCapiEvent({
        pixelId: payload.attribution_pixel_id,
        eventName: "Lead",
        eventSourceUrl: payload.landing_page || "https://www.bnblab.com.au/",
        email: payload.email,
        phone: payload.phone,
        firstName: payload.name.split(" ")[0],
        eventId: payload.meta_event_id || `lead_${payload.email}_${Date.now()}`,
        fbp: getCookie(req, "_fbp"),
        fbc: getCookie(req, "_fbc"),
        clientIpAddress: ip === "unknown" ? null : ip,
        clientUserAgent: req.headers.get("user-agent"),
        customData: {
          content_name: "BNB Lab Application",
          referrer: payload.referrer,
          attribution_ref: payload.attribution_ref,
          capital: payload.capital,
          ready_to_start: payload.ready_to_start,
          utm_source: payload.utm_source,
          utm_medium: payload.utm_medium,
          utm_campaign: payload.utm_campaign,
          utm_content: payload.utm_content,
          utm_term: payload.utm_term,
        },
      });
    } else {
      console.log("Lead CAPI skipped because no paid attribution exists.");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Application route failed:", e);

    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}

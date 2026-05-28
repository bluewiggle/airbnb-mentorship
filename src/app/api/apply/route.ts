import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function clean(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

function getCookie(req: Request, name: string) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(req: Request) {
  try {
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

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
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
        { ok: false, error: `Supabase insert failed: ${text}` },
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
        clientIpAddress: getClientIp(req),
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

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    const unbookedLeadsWebhookUrl = process.env.DISCORD_UNBOOKED_LEADS_WEBHOOK_URL;

    if (resend && adminEmail) {
      await resend.emails.send({
        from: "BNB Lab <onboarding@resend.dev>",
        to: adminEmail,
        subject: "New BNB Lab application",
        html: `
          <h2>New application</h2>
          <p><b>Name:</b> ${escapeHtml(payload.name)}</p>
          <p><b>Email:</b> ${escapeHtml(payload.email)}</p>
          <p><b>Phone:</b> ${escapeHtml(payload.phone)}</p>
          <p><b>State:</b> ${escapeHtml(payload.state)}</p>
          <p><b>Capital:</b> ${escapeHtml(payload.capital)}</p>
          <p><b>Ready to start:</b> ${escapeHtml(payload.ready_to_start)}</p>
          <p><b>Assigned to:</b> ${escapeHtml(payload.referrer)}</p>
        `,
      });
    }

    if (payload.status === "application_submitted" && unbookedLeadsWebhookUrl) {
      try {
        const discordRes = await fetch(unbookedLeadsWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `📝 NEW WEBSITE APPLICATION

    👤 Name: ${payload.name || "N/A"}
    📧 Email: ${payload.email || "N/A"}
    📱 Phone: ${payload.phone || "N/A"}
    📍 State: ${payload.state || "N/A"}
    💰 Capital: ${payload.capital || "N/A"}
    ⏳ Ready: ${payload.ready_to_start || "N/A"}

    🎯 Assigned To: ${payload.referrer || "Unassigned"}

    ⚠️ They filled the form but have not booked a call yet.`,
          }),
        });

        if (!discordRes.ok) {
          const text = await discordRes.text();
          console.error("Unbooked lead Discord webhook failed:", text);
        }
      } catch (error) {
        console.error("Failed to send unbooked lead to Discord:", error);
      }
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
import { NextRequest } from "next/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

function clean(value: unknown, maxLength = 120) {
  return String(value || "").trim().slice(0, maxLength);
}

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

function getCookie(req: NextRequest, name: string) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const eventType = body.event;
    const payload = body.payload;

    if (eventType !== "invitee.created") {
      return Response.json({
        success: true,
        message: "Ignored non-booking event.",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables.");

      return Response.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const booking = {
      name: clean(payload?.name, 80),
      email: clean(payload?.email, 120).toLowerCase(),
      phone: clean(
        payload?.questions_and_answers?.find((q: any) =>
          String(q.question || "").toLowerCase().includes("phone")
        )?.answer,
        40
      ),
      starts_at: payload?.scheduled_event?.start_time || null,
      calendly_event_uri: payload?.scheduled_event?.uri || null,
      calendly_invitee_uri: payload?.uri || null,
    };

    if (!booking.email || !booking.starts_at) {
      console.error("Calendly webhook missing email or starts_at:", booking);

      return Response.json(
        { success: false, error: "Missing required booking details." },
        { status: 400 }
      );
    }

    const updateRes = await fetch(
      `${supabaseUrl}/rest/v1/applications?email=eq.${encodeURIComponent(
        booking.email
      )}&order=created_at.desc&limit=1`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          starts_at: booking.starts_at,
          calendly_event_uri: booking.calendly_event_uri,
          calendly_invitee_uri: booking.calendly_invitee_uri,
          status: "call_booked",
        }),
      }
    );

    if (!updateRes.ok) {
      const text = await updateRes.text();

      // Supabase/Postgres duplicate key error.
      // This usually means Calendly sent the same booking webhook again,
      // or the booking was already saved by another route.
      if (text.includes('"code":"23505"') || text.includes("duplicate key")) {
        console.warn("Calendly booking already saved. Ignoring duplicate webhook:", text);

        return Response.json({
          success: true,
          duplicate: true,
          message: "Calendly booking already saved.",
        });
      }

      console.error("Failed to update Supabase with Calendly booking:", text);

      return Response.json(
        { success: false, error: "Failed to save Calendly booking." },
        { status: 500 }
      );
    }

    const updatedRows = await updateRes.json();
    const application = Array.isArray(updatedRows) ? updatedRows[0] : null;

    if (application?.attribution_pixel_id && application?.attribution_ref) {
      await sendMetaCapiEvent({
        pixelId: application.attribution_pixel_id,
        eventName: "Schedule",
        eventSourceUrl: application.landing_page || "https://www.bnblab.com.au/",
        email: application.email || booking.email,
        phone: application.phone || booking.phone,
        firstName: application.name?.split(" ")?.[0] || booking.name?.split(" ")?.[0],
        eventId: `schedule_${booking.email}_${booking.calendly_event_uri || booking.starts_at}`,
        fbp: getCookie(req, "_fbp"),
        fbc: getCookie(req, "_fbc"),
        clientIpAddress: getClientIp(req),
        clientUserAgent: req.headers.get("user-agent"),
        customData: {
          content_name: "BNB Lab Booked Call",
          referrer: application.referrer,
          attribution_ref: application.attribution_ref,
          starts_at: booking.starts_at,
          calendly_event_uri: booking.calendly_event_uri,
          calendly_invitee_uri: booking.calendly_invitee_uri,
        },
      });
    } else {
      console.log("Calendly Schedule CAPI skipped because no paid attribution exists or no matching application row was found.", {
        email: booking.email,
        hasApplication: Boolean(application),
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Calendly webhook failed:", error);

    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server";
import crypto from "crypto";
import { sendMetaCapiEvent } from "@/lib/meta-capi";
import { scheduleGuideEmails } from "@/lib/guide-emails";
import { clean, timingSafeCompare } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_TOLERANCE_SECONDS = 5 * 60;

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

function formatMelbourneDateTime(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

function verifyCalendlySignature(
  rawBody: string,
  signatureHeader: string,
  signingKey: string
) {
  const parts = signatureHeader.split(",");

  const timestamp = parts
    .find((part) => part.trim().startsWith("t="))
    ?.trim()
    .replace("t=", "");

  const signatures = parts
    .filter((part) => part.trim().startsWith("v1="))
    .map((part) => part.trim().replace("v1=", ""));

  if (!timestamp || !signatures.length) {
    return false;
  }

  const timestampNumber = Number(timestamp);

  if (
    !Number.isFinite(timestampNumber) ||
    Math.abs(Date.now() / 1000 - timestampNumber) > WEBHOOK_TOLERANCE_SECONDS
  ) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return signatures.some((signature) =>
    timingSafeCompare(signature, expectedSignature)
  );
}

async function sendBookedCallToDiscord({
  application,
  booking,
}: {
  application: any;
  booking: {
    name: string;
    email: string;
    phone: string;
    starts_at: string;
  };
}) {
  const webhookUrl = process.env.DISCORD_CALLS_WEBHOOK_URL;

  if (!webhookUrl) return;

  const name = clean(application?.name || booking.name || "N/A", 80);
  const email = clean(application?.email || booking.email || "N/A", 120);
  const phone = clean(application?.phone || booking.phone || "N/A", 40);
  const state = clean(application?.state || "N/A", 80);
  const capital = clean(application?.capital || "N/A", 60);
  const readyToStart = clean(application?.ready_to_start || "N/A", 60);
  const referrer = clean(application?.referrer || "Unassigned", 80);
  const bookingTime = booking.starts_at
    ? formatMelbourneDateTime(booking.starts_at)
    : "N/A";

  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `🔥 NEW BOOKED CALL

👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
📍 State: ${state}
💰 Capital: ${capital}
⏳ Ready: ${readyToStart}
🕘 Booking Time: ${bookingTime}

🎯 Assigned To: ${referrer}`,
      allowed_mentions: {
        parse: [],
      },
    }),
  });

  if (!discordRes.ok) {
    const text = await discordRes.text();
    console.error("Booked call Discord webhook failed:", text);
  }
}

export async function POST(req: NextRequest) {
  try {
    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

    if (!signingKey) {
      console.error("Missing CALENDLY_WEBHOOK_SIGNING_KEY.");

      return Response.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const signatureHeader = req.headers.get("calendly-webhook-signature");

    if (!signatureHeader) {
      return Response.json(
        { success: false, error: "Missing Calendly signature." },
        { status: 400 }
      );
    }

    const rawBody = await req.text();

    if (!verifyCalendlySignature(rawBody, signatureHeader, signingKey)) {
      console.error("Invalid Calendly webhook signature.");

      return Response.json(
        { success: false, error: "Invalid signature." },
        { status: 400 }
      );
    }

    const body = JSON.parse(rawBody);

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

    const lookupRes = await fetch(
      `${supabaseUrl}/rest/v1/applications?email=eq.${encodeURIComponent(
        booking.email
      )}&select=*&order=created_at.desc&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!lookupRes.ok) {
      const text = await lookupRes.text();
      console.error("Failed to find matching application for Calendly booking:", text);

      return Response.json(
        { success: false, error: "Failed to find matching application." },
        { status: 500 }
      );
    }

    const matchingRows = await lookupRes.json();
    let application = Array.isArray(matchingRows) ? matchingRows[0] : null;

    const alreadyHadGuideEmailOrBooking = Array.isArray(matchingRows)
      ? matchingRows.some((row) =>
          Boolean(
            row?.guide_email_id ||
              row?.guide_email_scheduled_at ||
              row?.guide_reminder_email_id ||
              row?.guide_reminder_scheduled_at ||
              row?.calendly_invitee_uri ||
              row?.calendly_event_uri ||
              row?.status === "call_booked"
          )
        )
      : false;

    if (!application) {
      console.warn("No matching application row found for Calendly booking. Discord will use booking details only.", {
        email: booking.email,
        calendly_invitee_uri: booking.calendly_invitee_uri,
      });
    } else if (!application.id) {
      console.error("Matching application row has no id. Cannot safely update a single row.", {
        email: booking.email,
        application,
      });
    } else {
      const updateRes = await fetch(
        `${supabaseUrl}/rest/v1/applications?id=eq.${encodeURIComponent(
          String(application.id)
        )}`,
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

        if (text.includes('"code":"23505"') || text.includes("duplicate key")) {
          console.warn("Calendly booking already exists on another application row. Fetching existing row and continuing to Discord:", text);

          if (booking.calendly_invitee_uri) {
            const existingBookingRes = await fetch(
              `${supabaseUrl}/rest/v1/applications?calendly_invitee_uri=eq.${encodeURIComponent(
                booking.calendly_invitee_uri
              )}&select=*&limit=1`,
              {
                method: "GET",
                headers: {
                  apikey: serviceRoleKey,
                  Authorization: `Bearer ${serviceRoleKey}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (existingBookingRes.ok) {
              const existingRows = await existingBookingRes.json();
              const existingApplication = Array.isArray(existingRows) ? existingRows[0] : null;

              if (existingApplication) {
                application = existingApplication;
              }
            } else {
              const existingText = await existingBookingRes.text();
              console.error("Failed to fetch existing Calendly booking row after duplicate key:", existingText);
            }
          }
        } else {
          console.error("Failed to update Supabase with Calendly booking:", text);

          return Response.json(
            { success: false, error: "Failed to save Calendly booking." },
            { status: 500 }
          );
        }
      } else {
        const updatedRows = await updateRes.json();
        application = Array.isArray(updatedRows) ? updatedRows[0] : application;
      }
    }

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

    if (alreadyHadGuideEmailOrBooking) {
      console.log("Skipping booked-call Discord message because this application/email already had a booked call. This is probably a duplicate Calendly webhook or a reschedule.", {
        email: booking.email,
        applicationId: application?.id || null,
        calendlyInviteeUri: application?.calendly_invitee_uri || null,
        calendlyEventUri: application?.calendly_event_uri || null,
        status: application?.status || null,
      });
    } else {
      await sendBookedCallToDiscord({ application, booking });
    }

    if (!application?.id) {
      console.log("Skipping guide emails because no matching website application row was found.", {
        email: booking.email,
      });
    } else if (alreadyHadGuideEmailOrBooking) {
      console.log("Skipping guide emails because this application/email already had a booked call. This is probably a duplicate Calendly webhook or a reschedule.", {
        email: booking.email,
        applicationId: application.id,
        guideEmailId: application.guide_email_id || null,
        calendlyInviteeUri: application.calendly_invitee_uri || null,
        calendlyEventUri: application.calendly_event_uri || null,
        status: application.status || null,
      });
    } else {
      const guideEmailResult = await scheduleGuideEmails({
        name: application?.name || booking.name,
        email: application?.email || booking.email,
        startsAt: booking.starts_at,
      });

      if (guideEmailResult) {
        const guideUpdateRes = await fetch(
          `${supabaseUrl}/rest/v1/applications?id=eq.${encodeURIComponent(
            String(application.id)
          )}`,
          {
            method: "PATCH",
            headers: {
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              guide_email_id: guideEmailResult.guideEmailId,
              guide_email_scheduled_at: guideEmailResult.guideEmailScheduledAt,
              guide_reminder_email_id: guideEmailResult.guideReminderEmailId,
              guide_reminder_scheduled_at:
                guideEmailResult.guideReminderScheduledAt,
            }),
          }
        );

        if (!guideUpdateRes.ok) {
          const text = await guideUpdateRes.text();
          console.error("Failed to save guide email scheduling details:", text);
        }
      }
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

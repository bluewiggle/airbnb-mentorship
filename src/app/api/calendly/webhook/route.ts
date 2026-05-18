import { NextRequest } from "next/server";

function clean(value: unknown, maxLength = 120) {
  return String(value || "").trim().slice(0, maxLength);
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
      email: clean(payload?.email, 120),
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
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          starts_at: booking.starts_at,
          calendly_event_uri: booking.calendly_event_uri,
          calendly_invitee_uri: booking.calendly_invitee_uri,
        }),
      }
    );

    if (!updateRes.ok) {
      const text = await updateRes.text();
      console.error("Failed to update Supabase with Calendly booking:", text);

      return Response.json(
        { success: false, error: "Failed to save Calendly booking." },
        { status: 500 }
      );
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
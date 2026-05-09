import { NextRequest } from "next/server";

type Booking = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  instagram?: string | null;
  capital?: string | null;
  ready_to_start?: string | null;
  referrer?: string | null;
  starts_at?: string | null;
};

function clean(value: unknown, maxLength = 120) {
  return String(value || "")
    .trim()
    .replaceAll("@everyone", "[everyone]")
    .replaceAll("@here", "[here]")
    .slice(0, maxLength);
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

function getTomorrowMelbourneRangeUtc() {
  const now = new Date();

  const melbourneParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(melbourneParts.find((p) => p.type === "year")?.value);
  const month = Number(melbourneParts.find((p) => p.type === "month")?.value);
  const day = Number(melbourneParts.find((p) => p.type === "day")?.value);

  const todayMelbourneAsUtc = new Date(Date.UTC(year, month - 1, day));
  const tomorrowMelbourneAsUtc = new Date(todayMelbourneAsUtc);
  tomorrowMelbourneAsUtc.setUTCDate(tomorrowMelbourneAsUtc.getUTCDate() + 1);

  const nextDayMelbourneAsUtc = new Date(tomorrowMelbourneAsUtc);
  nextDayMelbourneAsUtc.setUTCDate(nextDayMelbourneAsUtc.getUTCDate() + 1);

  const startLocalString = tomorrowMelbourneAsUtc.toISOString().slice(0, 10);
  const endLocalString = nextDayMelbourneAsUtc.toISOString().slice(0, 10);

  const startUtc = new Date(`${startLocalString}T00:00:00+10:00`);
  const endUtc = new Date(`${endLocalString}T00:00:00+10:00`);

  return {
    startUtc: startUtc.toISOString(),
    endUtc: endUtc.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!webhookUrl || !supabaseUrl || !serviceRoleKey) {
      console.error("Missing required environment variables.");

      return Response.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const { startUtc, endUtc } = getTomorrowMelbourneRangeUtc();

    const query = new URLSearchParams({
      select: "name,email,phone,instagram,capital,ready_to_start,referrer,starts_at",
      starts_at: `gte.${startUtc}`,
      order: "starts_at.asc",
    });

    const bookingsRes = await fetch(
      `${supabaseUrl}/rest/v1/Supabase?${query.toString()}&starts_at=lt.${endUtc}`
      {
        method: "GET",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    if (!bookingsRes.ok) {
      const text = await bookingsRes.text();
      console.error("Failed to fetch booked calls:", text);

      return Response.json(
        { success: false, error: "Failed to fetch booked calls." },
        { status: 500 }
      );
    }

    const bookings = (await bookingsRes.json()) as Booking[];

    if (!bookings.length) {
      return Response.json({
        success: true,
        message: "No bookings tomorrow. No Discord reminder sent.",
      });
    }

    const bookingLines = bookings
      .map((booking, index) => {
        const time = booking.starts_at
          ? formatMelbourneDateTime(booking.starts_at)
          : "Time missing";

        return `${index + 1}. ${time}
👤 ${clean(booking.name) || "N/A"}
📧 ${clean(booking.email) || "N/A"}
📱 ${clean(booking.phone) || "N/A"}
💰 ${clean(booking.capital) || "N/A"}
🎯 ${clean(booking.referrer) || "Unassigned"}`;
      })
      .join("\n\n");

    const message = `🌙 DAILY CALL REMINDER

You have ${bookings.length} call${bookings.length === 1 ? "" : "s"} tomorrow:

${bookingLines}`;

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        allowed_mentions: {
          parse: [],
        },
      }),
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      console.error("Discord reminder failed:", text);

      return Response.json(
        { success: false, error: "Failed to send Discord reminder." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      bookings: bookings.length,
    });
  } catch (error) {
    console.error("Discord reminder cron failed:", error);

    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
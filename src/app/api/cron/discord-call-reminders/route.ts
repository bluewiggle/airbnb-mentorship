import { NextRequest } from "next/server";

type CalendlyEvent = {
  name?: string;
  start_time?: string;
  end_time?: string;
  event_memberships?: {
    user_name?: string;
    user_email?: string;
  }[];
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

  const melbourneDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const tomorrow = new Date(`${melbourneDate}T00:00:00+10:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  return {
    startUtc: tomorrow.toISOString(),
    endUtc: dayAfterTomorrow.toISOString(),
  };
}

async function getCalendlyUserUri(token: string) {
  const res = await fetch("https://api.calendly.com/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch Calendly user: ${text}`);
  }

  const data = await res.json();
  return data.resource.uri as string;
}

async function getCalendlyEvents(token: string, userUri: string, startUtc: string, endUtc: string) {
  const params = new URLSearchParams({
    user: userUri,
    min_start_time: startUtc,
    max_start_time: endUtc,
    status: "active",
    sort: "start_time:asc",
  });

  const res = await fetch(`https://api.calendly.com/scheduled_events?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch Calendly events: ${text}`);
  }

  const data = await res.json();
  return (data.collection || []) as CalendlyEvent[];
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const melbourneHour = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Melbourne",
      hour: "numeric",
      hour12: false,
    }).format(new Date());

    if (Number(melbourneHour) !== 21) {
      return Response.json({
        success: true,
        message: "Not 9pm Melbourne time. Skipping reminder.",
      });
    }
    const calendlyToken = process.env.CALENDLY_TOKEN;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!calendlyToken || !webhookUrl) {
      console.error("Missing CALENDLY_TOKEN or DISCORD_WEBHOOK_URL");

      return Response.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const { startUtc, endUtc } = getTomorrowMelbourneRangeUtc();

    const userUri = await getCalendlyUserUri(calendlyToken);
    const events = await getCalendlyEvents(calendlyToken, userUri, startUtc, endUtc);

    if (!events.length) {
      return Response.json({
        success: true,
        message: "No Calendly bookings tomorrow. No Discord reminder sent.",
      });
    }

    const eventLines = events
      .map((event, index) => {
        const time = event.start_time
          ? formatMelbourneDateTime(event.start_time)
          : "Time missing";

        const host =
          event.event_memberships?.[0]?.user_name ||
          event.event_memberships?.[0]?.user_email ||
          "N/A";

        return `${index + 1}. ${time}
📞 ${clean(event.name) || "Booked call"}
👤 Host: ${clean(host)}`;
      })
      .join("\n\n");

    const message = `🌙 DAILY CALL REMINDER

You have ${events.length} Calendly call${events.length === 1 ? "" : "s"} tomorrow:

${eventLines}`;

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
      events: events.length,
    });
  } catch (error) {
    console.error("Discord reminder cron failed:", error);

    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
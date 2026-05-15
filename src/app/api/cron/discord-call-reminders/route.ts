import { NextRequest } from "next/server";

type CalendlyEvent = {
  uri?: string;
  name?: string;
  start_time?: string;
  end_time?: string;
  event_memberships?: {
    user_name?: string;
    user_email?: string;
  }[];
};

type CalendlyInvitee = {
  name?: string;
  email?: string;
  text_reminder_number?: string;
  questions_and_answers?: {
    question?: string;
    answer?: string;
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

async function getCalendlyInvitees(token: string, eventUri?: string) {
  if (!eventUri) return [];

  const eventUuid = eventUri.split("/").pop();

  if (!eventUuid) return [];

  const res = await fetch(`https://api.calendly.com/scheduled_events/${eventUuid}/invitees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to fetch invitees for event ${eventUuid}:`, text);
    return [];
  }

  const data = await res.json();
  return (data.collection || []) as CalendlyInvitee[];
}

function getAnswer(invitee: CalendlyInvitee, keyword: string) {
  return invitee.questions_and_answers?.find((item) =>
    String(item.question || "").toLowerCase().includes(keyword.toLowerCase())
  )?.answer;
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

    const eventLines = await Promise.all(
      events.map(async (event, index) => {
        const time = event.start_time
          ? formatMelbourneDateTime(event.start_time)
          : "Time missing";

        const invitees = await getCalendlyInvitees(calendlyToken, event.uri);
        const invitee = invitees[0];

        const name = invitee?.name || "Name missing";
        const email = invitee?.email || "Email missing";
        const phone =
          getAnswer(invitee || {}, "phone") ||
          invitee?.text_reminder_number ||
          "Phone missing";

        const capital = getAnswer(invitee || {}, "capital") || "N/A";
        const timeline =
          getAnswer(invitee || {}, "ready") ||
          getAnswer(invitee || {}, "start") ||
          "N/A";

        return `${index + 1}. ${time}
📞 ${clean(event.name) || "Booked call"}
👤 Name: ${clean(name)}
📧 Email: ${clean(email)}
📱 Phone: ${clean(phone)}
💰 Capital: ${clean(capital)}
⏳ Ready to start: ${clean(timeline)}`;
      })
    );

    const message = `🌙 DAILY CALL REMINDER

You have ${events.length} Calendly call${events.length === 1 ? "" : "s"} tomorrow:

${eventLines.join("\n\n")}`;

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
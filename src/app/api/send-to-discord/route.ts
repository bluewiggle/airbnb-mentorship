type CalendlyEventResponse = {
  resource?: {
    name?: string;
    start_time?: string;
    end_time?: string;
  };
};

function clean(value: unknown, maxLength = 100) {
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

async function getCalendlyBookingTime(eventUri: string | null | undefined) {
  const calendlyToken = process.env.CALENDLY_TOKEN;

  if (!calendlyToken || !eventUri) {
    return null;
  }

  const res = await fetch(eventUri, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${calendlyToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch Calendly event:", text);
    return null;
  }

  const data = (await res.json()) as CalendlyEventResponse;

  return data.resource?.start_time || null;
}

export async function POST(req: Request) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Missing DISCORD_WEBHOOK_URL");

      return Response.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const data = await req.json();

    const bookingStartTime = await getCalendlyBookingTime(
      data.calendly_event_uri
    );

    const formattedBookingTime = bookingStartTime
      ? formatMelbourneDateTime(bookingStartTime)
      : "Could not fetch booking time";

    const payload = {
      name: clean(data.name, 80),
      email: clean(data.email, 120),
      phone: clean(data.phone, 40),
      capital: clean(data.capital, 60),
      ready_to_start: clean(data.ready_to_start, 60),
      state: clean(data.state, 80),
      referrer: clean(data.referrer, 80),
      status: clean(data.status, 80),
      rejection_reason: clean(data.rejection_reason, 160),
      booking_time: clean(formattedBookingTime, 120),
    };

    const isRejected =
      payload.status.startsWith("rejected") || !!payload.rejection_reason;

    const message = isRejected
      ? `🚫 APPLICATION DENIED

    👤 Name: ${payload.name || "N/A"}
    📧 Email: ${payload.email || "N/A"}
    📱 Phone: ${payload.phone || "N/A"}
    📍 State: ${payload.state || "N/A"}
    💰 Capital: ${payload.capital || "N/A"}
    ⏳ Ready: ${payload.ready_to_start || "N/A"}

    ❌ Reason: ${payload.rejection_reason || payload.status || "N/A"}
    🎯 Assigned To: ${payload.referrer || "Unassigned"}`
      : `🔥 NEW BOOKED CALL

    👤 Name: ${payload.name || "N/A"}
    📧 Email: ${payload.email || "N/A"}
    📱 Phone: ${payload.phone || "N/A"}
    💰 Capital: ${payload.capital || "N/A"}
    ⏳ Ready: ${payload.ready_to_start || "N/A"}
    🕘 Booking Time: ${payload.booking_time || "N/A"}

    🎯 Assigned To: ${payload.referrer || "Unassigned"}`;

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
      console.error("Discord webhook failed:", text);

      return Response.json(
        { success: false, error: "Failed to send Discord notification." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Discord route failed:", error);

    return Response.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
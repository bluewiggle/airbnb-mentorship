function clean(value: unknown, maxLength = 100) {
  return String(value || "")
    .trim()
    .replaceAll("@everyone", "[everyone]")
    .replaceAll("@here", "[here]")
    .slice(0, maxLength);
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

    const payload = {
      name: clean(data.name, 80),
      email: clean(data.email, 120),
      phone: clean(data.phone, 40),
      capital: clean(data.capital, 60),
      ready_to_start: clean(data.ready_to_start, 60),
      referrer: clean(data.referrer, 80),
    };

    const message = `🔥 NEW BOOKED CALL

👤 Name: ${payload.name || "N/A"}
📧 Email: ${payload.email || "N/A"}
📱 Phone: ${payload.phone || "N/A"}
💰 Capital: ${payload.capital || "N/A"}
⏳ Ready: ${payload.ready_to_start || "N/A"}

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
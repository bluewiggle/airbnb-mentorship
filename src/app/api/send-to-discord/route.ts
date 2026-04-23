export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("DATA RECEIVED:", data);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("NO WEBHOOK URL SET");
      return Response.json({ error: "no webhook" }, { status: 500 });
    }

    // ✅ SEND TO DISCORD
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `🔥 NEW BOOKED CALL

👤 Name: ${data.name || "N/A"}
📧 Email: ${data.email || "N/A"}
📱 Phone: ${data.phone || "N/A"}
💰 Capital: ${data.capital || "N/A"}
⏳ Ready: ${data.ready_to_start || "N/A"}`
      })
    });

    console.log("DISCORD STATUS:", discordRes.status);

    return Response.json({ success: true });

  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
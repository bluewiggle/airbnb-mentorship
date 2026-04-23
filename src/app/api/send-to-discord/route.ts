export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("DATA RECEIVED:", data);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return Response.json(
        { success: false, error: "Missing DISCORD_WEBHOOK_URL" },
        { status: 500 }
      );
    }

    // ✅ SEND TO DISCORD
    await fetch(webhookUrl, {
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

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error sending to Discord:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
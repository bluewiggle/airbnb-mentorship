export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("DATA RECEIVED:", data);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("NO WEBHOOK URL SET");
      return Response.json({ error: "no webhook" }, { status: 500 });
    }

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `🔥 TEST MESSAGE

Name: ${data.name}
Email: ${data.email}`
      })
    });

    console.log("DISCORD STATUS:", discordRes.status);

    return Response.json({ success: true });

  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
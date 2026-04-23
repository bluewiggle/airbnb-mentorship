export async function POST(req: Request) {
  const data = await req.json();

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL!;

  const message = {
    content: `🔥 NEW BOOKED CALL

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Capital: ${data.capital}
Ready: ${data.ready_to_start}`
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });

  return Response.json({ success: true });
}
import { NextResponse } from "next/server";

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1496658018627092586/KdHuS83aiDZyrTfZtacX2xNZk0zHWBHKS05PxHE_k4IGNhsGhk_boBw18xuvj9rF3MWG";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      instagram: String(body.instagram || "").trim(),
      capital: String(body.capital || "").trim(),
      ready_to_start: String(body.ready_to_start || "").trim(),
    };

    // Insert into your table (YOUR table name is "Supabase")
    const supabaseUrl = process.env.SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/Supabase`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([payload]),
    });

    if (!insertRes.ok) {
      const text = await insertRes.text();
      return NextResponse.json({ ok: false, error: text }, { status: 500 });
    }

    // Send to Discord
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "New BNB Lab Application",
            color: 0xff5a5f,
            fields: [
              { name: "Name", value: payload.name, inline: true },
              { name: "Email", value: payload.email, inline: true },
              { name: "Phone", value: payload.phone, inline: true },
              { name: "Instagram", value: payload.instagram, inline: true },
              { name: "Capital", value: payload.capital, inline: true },
              { name: "Ready to Start", value: payload.ready_to_start, inline: true },
            ],
          },
        ],
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
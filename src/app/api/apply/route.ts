import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email
    await resend.emails.send({
      from: "BNB Lab <onboarding@resend.dev>",
      to: process.env.ADMIN_NOTIFY_EMAIL!,
      subject: "New BNB Lab application",
      html: `
        <h2>New application</h2>
        <p><b>Name:</b> ${payload.name}</p>
        <p><b>Email:</b> ${payload.email}</p>
        <p><b>Phone:</b> ${payload.phone}</p>
        <p><b>Instagram:</b> ${payload.instagram}</p>
        <p><b>Capital:</b> ${payload.capital}</p>
        <p><b>Ready to start:</b> ${payload.ready_to_start}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
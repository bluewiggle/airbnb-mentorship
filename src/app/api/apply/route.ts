import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function clean(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      name: clean(body.name, 80),
      email: clean(body.email, 120),
      phone: clean(body.phone, 30),
      instagram: clean(body.instagram, 40),
      capital: clean(body.capital, 40),
      ready_to_start: clean(body.ready_to_start, 40),
    };

    if (!payload.name || !payload.email || !payload.phone) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;

    if (!supabaseUrl || !serviceRoleKey || !adminEmail) {
      console.error("Missing required environment variables.");

      return NextResponse.json(
        { ok: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/applications`, {
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
      console.error("Supabase insert failed:", text);

      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: "BNB Lab <onboarding@resend.dev>",
      to: adminEmail,
      subject: "New BNB Lab application",
      html: `
        <h2>New application</h2>
        <p><b>Name:</b> ${escapeHtml(payload.name)}</p>
        <p><b>Email:</b> ${escapeHtml(payload.email)}</p>
        <p><b>Phone:</b> ${escapeHtml(payload.phone)}</p>
        <p><b>Instagram:</b> ${escapeHtml(payload.instagram)}</p>
        <p><b>Capital:</b> ${escapeHtml(payload.capital)}</p>
        <p><b>Ready to start:</b> ${escapeHtml(payload.ready_to_start)}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Application route failed:", e);

    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
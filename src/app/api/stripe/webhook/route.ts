import { NextRequest } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

function clean(value: unknown, maxLength = 160) {
  return String(value || "")
    .trim()
    .replaceAll("@everyone", "[everyone]")
    .replaceAll("@here", "[here]")
    .slice(0, maxLength);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatMelbourneDateTimeFromUnix(unixSeconds: number) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(unixSeconds * 1000));
}

function timingSafeCompare(a: string, b: string) {
  const encoder = new TextEncoder();

  const aBuffer = encoder.encode(a);
  const bBuffer = encoder.encode(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string
) {
  const parts = signatureHeader.split(",");

  const timestamp = parts
    .find((part) => part.startsWith("t="))
    ?.replace("t=", "");

  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.replace("v1=", ""));

  if (!timestamp || !signatures.length) {
    return false;
  }

  const timestampNumber = Number(timestamp);

  if (
    !Number.isFinite(timestampNumber) ||
    Math.abs(Date.now() / 1000 - timestampNumber) > STRIPE_SIGNATURE_TOLERANCE_SECONDS
  ) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  return signatures.some((signature) =>
    timingSafeCompare(signature, expectedSignature)
  );
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const discordWebhookUrl = process.env.DISCORD_STRIPE_WEBHOOK_URL;

    if (!webhookSecret || !discordWebhookUrl) {
      console.error("Missing STRIPE_WEBHOOK_SECRET or DISCORD_STRIPE_WEBHOOK_URL");

      return Response.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const signatureHeader = req.headers.get("stripe-signature");

    if (!signatureHeader) {
      return Response.json(
        { success: false, error: "Missing Stripe signature." },
        { status: 400 }
      );
    }

    const rawBody = await req.text();

    const validSignature = verifyStripeSignature(
      rawBody,
      signatureHeader,
      webhookSecret
    );

    if (!validSignature) {
      console.error("Invalid Stripe webhook signature.");

      return Response.json(
        { success: false, error: "Invalid signature." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    if (!["charge.succeeded", "charge.failed"].includes(event.type)) {
      return Response.json({
        success: true,
        message: `Ignored event type: ${event.type}`,
      });
    }

    const charge = event.data.object;

    const amount =
      typeof charge.amount_captured === "number" && charge.amount_captured > 0
        ? charge.amount_captured
        : charge.amount;

    const currency = charge.currency || "aud";

    const customerName = clean(charge.billing_details?.name || "N/A");
    const customerEmail = clean(
      charge.billing_details?.email || charge.receipt_email || "N/A"
    );
    const customerPhone = clean(charge.billing_details?.phone || "N/A");

    const isFailed = event.type === "charge.failed";

    const declineReason =
      charge.failure_message ||
      charge.outcome?.seller_message ||
      charge.outcome?.reason ||
      "Payment failed";

    const message = isFailed
      ? `❌ STRIPE PAYMENT DECLINED

💰 Amount: ${formatAmount(amount, currency)}
👤 Name: ${customerName}
📧 Email: ${customerEmail}
📱 Phone: ${customerPhone}
🕘 Time: ${formatMelbourneDateTimeFromUnix(charge.created)}

Reason: ${clean(declineReason, 250)}`
      : `💸 STRIPE PAYMENT RECEIVED

💰 Amount: ${formatAmount(amount, currency)}
👤 Name: ${customerName}
📧 Email: ${customerEmail}
📱 Phone: ${customerPhone}
🕘 Time: ${formatMelbourneDateTimeFromUnix(charge.created)}`;

    const discordRes = await fetch(discordWebhookUrl, {
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
      console.error("Failed to send Stripe Discord notification:", text);

      return Response.json(
        { success: false, error: "Failed to send Discord notification." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: isFailed
        ? "Stripe declined payment notification sent."
        : "Stripe successful payment notification sent.",
    });
  } catch (error) {
    console.error("Stripe webhook failed:", error);

    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
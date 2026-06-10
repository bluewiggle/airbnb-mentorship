import { Resend } from "resend";

const GUIDE_DELAY_MINUTES = 3;
const REMINDER_BEFORE_CALL_MINUTES = 120;

const guidePdfUrl = process.env.GUIDE_PDF_URL;
const guideEmailFrom =
  process.env.GUIDE_EMAIL_FROM || "Noah from BNB Lab <no-reply@bnblab.com.au>";
const guideEmailReplyTo =
  process.env.GUIDE_EMAIL_REPLY_TO || "bnblab.official@gmail.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstName(name?: string | null) {
  return String(name || "")
    .trim()
    .split(/\s+/)[0] || "there";
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function formatMelbourneDateTime(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

function emailShell(params: {
  preview: string;
  heading: string;
  intro: string;
  body: string;
  buttonText: string;
}) {
  const url = escapeHtml(guidePdfUrl || "");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(params.heading)}</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f1ec; font-family:Arial, Helvetica, sans-serif; color:#111111;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(
      params.preview
    )}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ec; padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e8e0d6;">
            <tr>
              <td style="background:#090909; padding:28px 28px 24px; text-align:center;">
                <div style="font-size:28px; font-weight:900; letter-spacing:0.5px; color:#ffffff;">BNB<span style="color:#ff3333;">LAB</span></div>
                <div style="margin-top:8px; font-size:13px; color:#cfcfcf; letter-spacing:0.3px;">Learn. Build. Scale. Succeed.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 30px 8px;">
                <h1 style="margin:0 0 14px; font-size:26px; line-height:1.2; color:#111111;">${escapeHtml(
                  params.heading
                )}</h1>
                <p style="margin:0 0 20px; font-size:16px; line-height:1.65; color:#333333;">${params.intro}</p>
                ${params.body}
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 24px;">
                  <tr>
                    <td bgcolor="#e62929" style="border-radius:999px;">
                      <a href="${url}" target="_blank" style="display:inline-block; padding:15px 24px; color:#ffffff; text-decoration:none; font-size:15px; font-weight:800; border-radius:999px;">${escapeHtml(
                        params.buttonText
                      )}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 22px; font-size:15px; line-height:1.65; color:#333333;">If the button does not open, copy and paste this link into your browser:<br /><a href="${url}" target="_blank" style="color:#e62929; word-break:break-word;">${url}</a></p>
                <p style="margin:0 0 4px; font-size:15px; line-height:1.65; color:#333333;">Talk soon,</p>
                <p style="margin:0 0 28px; font-size:15px; line-height:1.65; color:#111111; font-weight:700;">Noah<br />BNB Lab</p>
              </td>
            </tr>
          </table>
          <p style="max-width:620px; margin:14px auto 0; font-size:12px; line-height:1.5; color:#7a746d; text-align:center;">You are receiving this because you booked a BNB Lab application call.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function guideEmail(params: { name?: string | null; startsAt: string }) {
  const safeFirstName = escapeHtml(firstName(params.name));
  const callTime = escapeHtml(formatMelbourneDateTime(params.startsAt));

  const intro = `Hey ${safeFirstName}, your BNB Lab call is booked for <strong>${callTime}</strong>.`;

  const body = `
    <p style="margin:0 0 18px; font-size:16px; line-height:1.65; color:#333333;">Before we speak, read the Airbnb Arbitrage Guide. It will give you the basics so we can use the call properly.</p>
    <div style="background:#fbf8f4; border:1px solid #efe5dc; border-radius:14px; padding:18px 18px; margin:20px 0;">
      <p style="margin:0 0 10px; font-size:15px; line-height:1.55; color:#111111; font-weight:800;">Inside the guide, you will see:</p>
      <ul style="margin:0; padding-left:20px; color:#333333; font-size:15px; line-height:1.7;">
        <li>What Airbnb arbitrage actually is</li>
        <li>Why the model can work when the numbers make sense</li>
        <li>The basic process from property selection to listing</li>
        <li>The biggest mistakes beginners make at the start</li>
        <li>How BNB Lab helps people move with a clearer plan</li>
      </ul>
    </div>
    <p style="margin:0 0 18px; font-size:16px; line-height:1.65; color:#333333;">The goal is simple. Read it before the call so we can skip the surface level stuff and talk about your situation, your numbers, and whether this model is actually a fit for you.</p>
  `;

  const text = `Hey ${firstName(params.name)},

Your BNB Lab call is booked for ${formatMelbourneDateTime(params.startsAt)}.

Before we speak, read the Airbnb Arbitrage Guide here:
${guidePdfUrl}

It covers what Airbnb arbitrage is, why the model can work when the numbers make sense, the basic process, the biggest mistakes beginners make, and how BNB Lab helps people move with a clearer plan.

The goal is simple. Read it before the call so we can skip the surface level stuff and talk about your situation, your numbers, and whether this model is actually a fit for you.

Talk soon,
Noah
BNB Lab`;

  return {
    subject: "Read this before your BNB Lab call",
    html: emailShell({
      preview: "Your BNB Lab call is booked. Read this guide before we speak.",
      heading: "Your call is booked",
      intro,
      body,
      buttonText: "Read the Airbnb Arbitrage Guide",
    }),
    text,
  };
}

function reminderEmail(params: { name?: string | null; startsAt: string }) {
  const safeFirstName = escapeHtml(firstName(params.name));
  const callTime = escapeHtml(formatMelbourneDateTime(params.startsAt));

  const intro = `Hey ${safeFirstName}, quick reminder that your BNB Lab call is coming up at <strong>${callTime}</strong>.`;

  const body = `
    <p style="margin:0 0 18px; font-size:16px; line-height:1.65; color:#333333;">Before we speak, read or skim the guide below. It will help you understand the model, the process, and the main mistakes to avoid.</p>
    <p style="margin:0 0 18px; font-size:16px; line-height:1.65; color:#333333;">That way, we can spend the call on the important part. Your situation, your capital, your timeline, and whether this is genuinely the right move for you.</p>
  `;

  const text = `Hey ${firstName(params.name)},

Quick reminder that your BNB Lab call is coming up at ${formatMelbourneDateTime(
    params.startsAt
  )}.

Before we speak, read or skim the guide here:
${guidePdfUrl}

It will help you understand the model, the process, and the main mistakes to avoid. That way, we can spend the call on your situation, your capital, your timeline, and whether this is genuinely the right move for you.

Talk soon,
Noah
BNB Lab`;

  return {
    subject: "Your BNB Lab call is coming up",
    html: emailShell({
      preview: "Quick reminder. Your BNB Lab call is coming up soon.",
      heading: "Your call is coming up",
      intro,
      body,
      buttonText: "Open the guide",
    }),
    text,
  };
}

export async function scheduleGuideEmails(params: {
  name?: string | null;
  email: string;
  startsAt: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Missing RESEND_API_KEY. Skipping guide emails.");
    return null;
  }

  if (!guidePdfUrl) {
    console.warn("Missing GUIDE_PDF_URL. Skipping guide emails.");
    return null;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const now = new Date();
  const callStart = new Date(params.startsAt);

  const guideScheduledAt = addMinutes(now, GUIDE_DELAY_MINUTES);
  const reminderScheduledAt = addMinutes(
    callStart,
    -REMINDER_BEFORE_CALL_MINUTES
  );

  const guide = guideEmail(params);
  const reminder = reminderEmail(params);

  const guideResult = await resend.emails.send({
    from: guideEmailFrom,
    to: params.email,
    subject: guide.subject,
    html: guide.html,
    text: guide.text,
    scheduledAt: guideScheduledAt.toISOString(),
    replyTo: guideEmailReplyTo,
  });

  if (guideResult.error) {
    console.error("Failed to schedule guide email:", guideResult.error);
  }

  let reminderResult: Awaited<ReturnType<typeof resend.emails.send>> | null = null;

  if (reminderScheduledAt.getTime() > addMinutes(now, 5).getTime()) {
    reminderResult = await resend.emails.send({
      from: guideEmailFrom,
      to: params.email,
      subject: reminder.subject,
      html: reminder.html,
      text: reminder.text,
      scheduledAt: reminderScheduledAt.toISOString(),
      replyTo: guideEmailReplyTo,
    });

    if (reminderResult.error) {
      console.error("Failed to schedule guide reminder email:", reminderResult.error);
    }
  } else {
    console.log("Skipping guide reminder email because the call is too close.", {
      email: params.email,
      startsAt: params.startsAt,
    });
  }

  return {
    guideEmailId: guideResult.data?.id || null,
    guideEmailScheduledAt: guideScheduledAt.toISOString(),
    guideReminderEmailId: reminderResult?.data?.id || null,
    guideReminderScheduledAt: reminderResult ? reminderScheduledAt.toISOString() : null,
  };
}

# Elevated Stripe Webhook Only

This project intentionally contains no public website or marketing frontend.
Normal browser URLs return Next.js's standard 404 response.

## Preserved endpoint

`POST /api/stripe/elevated-webhook`

It verifies Stripe webhook signatures and sends Discord notifications for:

- `charge.succeeded`
- `charge.failed`

## Required Vercel environment variables

- `STRIPE_ELEVATED_WEBHOOK_SECRET`
- `DISCORD_STRIPE_ELEVATED_WEBHOOK`

Keep the existing Stripe webhook destination pointed at:

`https://YOUR-DOMAIN/api/stripe/elevated-webhook`

Do not delete or rename the endpoint until the Stripe webhook is moved to another deployed service.

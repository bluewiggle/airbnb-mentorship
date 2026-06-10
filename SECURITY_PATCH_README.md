# Security patch notes

Files changed:

- `src/app/api/send-to-discord/route.ts`
  - Adds `INTERNAL_API_SECRET` auth.
  - Adds Calendly API URL allow-list before fetching with `CALENDLY_TOKEN`.

- `src/components/sections/apply.tsx`
  - Removes browser calls to `/api/send-to-discord`.
  - Removes browser calls to `/api/meta/schedule`.
  - Booking Discord + Schedule CAPI now happen from `/api/calendly/webhook`.
  - Rejection Discord now happens from `/api/apply`.

- `src/app/api/calendly/webhook/route.ts`
  - Adds Calendly webhook HMAC verification using `CALENDLY_WEBHOOK_SIGNING_KEY`.
  - Sends booked-call Discord notification server-side.
  - Keeps Schedule CAPI server-side.

- `src/app/api/apply/route.ts`
  - Adds IP/email rate limiting.
  - Blocks invalid `attribution_pixel_id` values.
  - Sanitises Discord mentions.
  - Stops leaking raw Supabase errors.
  - Sends denied/unbooked Discord notifications server-side with `allowed_mentions` disabled.

- `src/app/api/meta/schedule/route.ts`
  - Adds `INTERNAL_API_SECRET` auth.
  - Adds rate limiting.
  - Blocks invalid pixel IDs.

- `src/lib/meta-capi.ts`
  - Adds a hard allow-list for the two known Meta pixel IDs.
  - Removes the unsafe fallback where any supplied pixel ID could use `META_ACCESS_TOKEN`.

- `next.config.mjs`
  - Adds security headers.

- `src/app/api/stripe/webhook/route.ts`
- `src/app/api/stripe/elevated-webhook/route.ts`
  - Adds Stripe signature timestamp tolerance to reduce replay risk.

- `src/lib/rate-limit.ts`
  - New lightweight in-memory rate limiter.

- `src/lib/security.ts`
  - New shared sanitisation, timing-safe compare, and internal-auth helpers.

- `src/lib/supabase.ts`
  - Removed because it was dead code.

- `.env.example`
  - Added safe placeholder env list.

Important deploy step:

- Add `CALENDLY_WEBHOOK_SIGNING_KEY` to Vercel.
- Rotate every secret that was in `.env.local` before trusting production again.
- Do not upload `.env.local` in future zips.
- Run `npm install` locally before deploy if you also upgrade dependencies, then commit the updated `package-lock.json`.

# Airbnb Mentorship Website (Vercel-ready)

## Local dev
1. Install Node.js 18+.
2. In this folder:
   - `npm install`
   - `npm run dev`
3. Open http://localhost:3000

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: **New Project** → import repo.
3. Framework: Next.js (auto-detected).
4. Deploy.

## Where to edit content
- `src/app/page.tsx` controls section order.
- `src/components/sections/*` contains each section as its own component.
- Theme tokens: `src/app/globals.css` (look for `--accent` and background gradients).

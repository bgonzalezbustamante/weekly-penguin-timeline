# Weekly Penguin Timeline

A standalone proof-of-concept for a reusable Next.js weekly timeline component. It converts public daily working-time and coffee data into one Oxford-colour pixel penguin state per day.

This repository is intentionally separate from `academic-website`. No changes are made to that repository while the component is being explored.

## What the PoC does

- Reads `get_public_work_analytics(year)` from the Research Dashboard Academic API.
- Uses daily `net_minutes` and `coffee_count`.
- Resolves six working-time states: `0h`, `<4h`, `4–6h`, `6–8h`, `8–10h`, and `10h+`.
- Resolves five coffee states: `0`, `2–4`, `4–6`, `8–10`, and `10+`.
- Produces 30 normal combined activity states.
- Uses a praying penguin on Sundays.
- Supports manual overrides for winter holiday, summer holiday, trip, and sick dates.
- Treats future days as Upcoming rather than falsely displaying zero activity.
- Marks the current day as provisional with “so far”.
- Uses the Academic Website Oxford palette and typography hierarchy.

## Architecture

The proof-of-concept separates:

1. `lib/work-analytics.ts` — Academic API adapter.
2. `lib/timeline.ts` — date, bucket and override resolution.
3. `components/penguin-sprite.tsx` — deterministic pixel-style SVG sprite.
4. `components/weekly-penguin-timeline.tsx` — reusable seven-day presentation.
5. `content/special-dates.ts` — manual date overrides.
6. `app/page.tsx` — demonstration page only.

That separation is deliberate: the timeline component and resolver can later be moved into another Next.js application without retaining the PoC shell.

## Local setup

Requires Node.js 22 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Populate:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The publishable key is used only with the curated anonymous-safe RPC.

If the environment variables are absent or the RPC is unavailable, the demonstration page falls back to a small built-in sample week so the visual system can still be reviewed locally.

## Manual overrides

Edit `content/special-dates.ts`. Exact dates and inclusive ranges are supported:

```ts
{
  from: '2026-12-21',
  to: '2027-01-03',
  type: 'winter-holiday',
  label: 'Winter holiday',
}
```

Explicit manual overrides take precedence over Sunday. Otherwise Sunday takes precedence over the normal work/coffee state.

## Coffee-band note

The requested display intervals are `0`, `2–4`, `4–6`, `8–10`, and `10+`. As written, they omit 1 and 7 and overlap at 4 and 10. The PoC preserves those labels but uses one deterministic resolver for every integer count. The mapping is isolated in `resolveCoffeeBucket()` so it can be adjusted without changing any component code.

## Intended integration

The PoC is designed for eventual use in the Academic Website Home page, but integration is intentionally out of scope for this repository until the state model, visual language and special-date behaviour are approved.

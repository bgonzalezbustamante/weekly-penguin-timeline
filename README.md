# Weekly Penguin Timeline

**v0.1.0-alpha.1 "Bold Cipher" — in development**

A standalone proof-of-concept for a reusable Next.js weekly timeline component. It converts public daily working-time and coffee data into one Oxford-colour, pixel-inspired penguin state per day.

This repository is intentionally separate from `academic-website`. Development and review happen here before any future integration.

## What the PoC does

- Reads `get_public_work_analytics(year)` from the Research Dashboard Academic API.
- Uses live daily `net_minutes` and `coffee_count`; there is no built-in activity-data fallback.
- Resolves six working-time states: `0h`, `<4h`, `4–6h`, `6–8h`, `8–10h`, and `10h+`.
- Resolves five coffee states: `0`, `2–4`, `4–6`, `8–10`, and `10+`.
- Produces 30 normal combined activity states.
- Uses a praying penguin on Sundays.
- Supports manual overrides for winter holiday, summer holiday, trip, and sick dates.
- Treats future days as Upcoming rather than falsely displaying zero activity.
- Marks the current day as provisional with “so far”.
- Uses the Academic Website Oxford palette and typography hierarchy.
- Includes an interactive state tester for inspecting any work/coffee combination.

## Architecture

The proof-of-concept separates:

1. `lib/work-analytics.ts` — Academic API adapter.
2. `lib/timeline.ts` — date, bucket and override resolution.
3. `components/penguin-sprite.tsx` — deterministic illustrated SVG penguin.
4. `components/weekly-penguin-timeline.tsx` — reusable seven-day presentation.
5. `components/penguin-state-tester.tsx` — interactive state inspector.
6. `content/special-dates.ts` — manual date overrides.
7. `lib/releases.ts` and `CHANGELOG.md` — readable and technical release documentation.
8. `app/page.tsx` — demonstration page only.

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

The publishable key is used only with the curated anonymous-safe RPC. If the Academic API cannot be loaded, the page shows an explicit unavailable state; it does not substitute sample work or coffee values.

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

## Release documentation

`CHANGELOG.md` contains the technical record. `lib/releases.ts` contains the shorter reader-facing release notes shown on the demonstration page.

## Intended integration

The PoC is designed for eventual use in the Academic Website Home page, but integration is intentionally out of scope for this repository until the state model, visual language and special-date behaviour are approved.

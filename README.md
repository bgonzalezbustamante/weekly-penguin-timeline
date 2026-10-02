# Weekly Penguin Timeline

**v0.1.0-alpha.1 "Bold Cipher" — in development**

A standalone proof-of-concept for a reusable Next.js weekly timeline component. It converts public daily working-time and coffee data into one Oxford-colour, kawaii-style penguin state per day.

This repository is intentionally separate from `academic-website`. Development and review happen here before any future integration.

## What the PoC does

- Reads `get_public_work_analytics(year)` from the Research Dashboard Academic API.
- Uses live daily `net_minutes` and `coffee_count`; there is no built-in activity-data fallback.
- Resolves six working-time states: `0h`, `<4h`, `4–6h`, `6–8h`, `8–10h`, and `10h+`.
- Resolves six coffee states: `0`, `<4`, `4–6`, `6–8`, `8–10`, and `10+`.
- Produces 36 normal combined activity states.
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
3. `public/penguins/canonical-baseline.svg` — approved canonical mascot asset.
4. `components/penguin-sprite.tsx` — deterministic work, coffee, stress and special-state overlays around the canonical mascot.
5. `components/weekly-penguin-timeline.tsx` — reusable seven-day presentation.
6. `components/penguin-state-tester.tsx` — interactive state inspector.
7. `content/special-dates.ts` — manual date overrides.
8. `lib/releases.ts` and `CHANGELOG.md` — readable and technical release documentation.
9. `app/page.tsx` — demonstration page only.

That separation is deliberate: the canonical mascot is now an immutable visual baseline, while state logic and overlays remain independent. The timeline component and resolver can later be moved into another Next.js application without retaining the PoC shell.

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

## Activity bands

Working time and coffee use the same six threshold bands: zero, under 4, 4–6, 6–8, 8–10 and 10-plus. Working time is displayed in hours; coffee uses the same thresholds as counts. The combination produces 36 normal activity states.

## Release documentation

`CHANGELOG.md` contains the technical record. `lib/releases.ts` contains the shorter reader-facing release notes shown on the demonstration page.

## Intended integration

The PoC is designed for eventual use in the Academic Website Home page, but integration is intentionally out of scope for this repository until the state model, visual language and special-date behaviour are approved.

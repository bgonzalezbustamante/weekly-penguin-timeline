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
- Supports toggleable fixed Catholic celebrations that reuse the Sunday illustration with celebration-specific labels.
- Supports manual overrides for Sunday-style holidays, winter holiday, summer holiday, trip, and sick dates.
- Treats future days as Upcoming rather than falsely displaying zero activity.
- Marks the current day as provisional with “so far”.
- Uses the Academic Website Oxford palette and typography hierarchy.
- Includes an interactive state tester for inspecting any work/coffee combination.

## Architecture

The proof-of-concept separates:

1. `lib/work-analytics.ts` — Academic API adapter.
2. `lib/work-data.ts` — strict runtime validation for the public work-analytics contract.
3. `lib/date-utils.ts` and `lib/special-date-rules.ts` — calendar-date and override-rule validation.
4. `lib/timeline.ts` — date, bucket and override resolution.
5. `public/penguins/canonical-baseline.png` — approved canonical mascot asset.
6. `lib/penguin-assets.ts` — deterministic mapping from resolved state to approved image asset.
7. `public/penguins/states/` — 36 validated activity PNG masters plus five validated special-state PNG masters.
8. `scripts/penguin-assets.mjs` — asset-integrity validation and incremental WebP generation.
9. `components/penguin-sprite.tsx` — lightweight renderer for the generated WebP runtime asset.
10. `components/weekly-penguin-timeline.tsx` — reusable seven-day presentation.
11. `components/penguin-state-tester.tsx` — interactive state inspector.
12. `components/penguin-state-gallery.tsx` — complete visual QA matrix for the 36 normal states and five special states.
13. `content/special-dates.ts` — manual date overrides plus the toggleable fixed Catholic celebration set.
14. `tests/` — data-contract, date-rule, boundary, timezone and asset-resolution regression tests.
15. `lib/releases.ts` and `CHANGELOG.md` — readable and technical release documentation.
16. `app/page.tsx` — demonstration page only.

That separation is deliberate: the canonical mascot remains the immutable visual ground truth, while each approved state is a complete derived image rather than a runtime SVG composition. The validated PNG files remain the source masters. Development and production builds generate ignored WebP derivatives for runtime delivery, so optimisation never overwrites the approved images. State resolution remains independent of presentation, allowing the timeline to move into another Next.js application without retaining the PoC shell.

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

The publishable key is used only with the curated anonymous-safe RPC. The adapter validates the returned year, annual averages and every daily row before the data reach the timeline. Duplicate dates, malformed dates, negative/non-integer daily metrics and incomplete calendar-year payloads fail explicitly rather than being silently coerced. If the Academic API cannot be loaded or violates its contract, the page shows an explicit unavailable state; it does not substitute sample work or coffee values.

## Penguin asset pipeline

The 42 PNG masters are validated before development and production builds: one canonical baseline, 36 normal activity states, and five special states. Validation checks filenames, PNG structure, minimum dimensions and file integrity; transparency is reported as an additional diagnostic.

`npm run dev` and `npm run build` automatically create WebP runtime derivatives when they are missing or older than their PNG source. Generated WebP files are ignored by Git and the PNG masters are never modified.

Useful commands:

```bash
npm run assets:validate
npm run assets:generate
npm run assets:generate:force
```

If a PNG master is replaced while the development server is already running, run `npm run assets:generate` and refresh the page. Because the renderer serves the pre-generated WebP directly, it does not rely on Next.js image-optimiser cache entries.

## Special dates

Edit `content/special-dates.ts`. The built-in fixed Catholic celebrations are controlled by:

```ts
export const ENABLE_CATHOLIC_FIXED_DATES = true
```

When enabled, the recurring fixed-date set is Assumption (15 August), All Saints (1 November), All Souls (2 November), Immaculate Conception (8 December), Christmas Eve (24 December), and Christmas Day (25 December). The 1 January celebration is intentionally not included.

Manual exact dates and inclusive ranges remain supported. A labelled `sunday` override can reuse the praying Sunday illustration for Christian holidays on any weekday:

```ts
{
  date: '2027-03-26',
  type: 'sunday',
  label: 'Good Friday',
}

{
  from: '2026-12-21',
  to: '2027-01-03',
  type: 'winter-holiday',
  label: 'Winter holiday',
}
```

Precedence is: manual special date → enabled fixed Catholic date → automatic weekly Sunday → normal/upcoming state. Manual rules are validated as real calendar dates and ranges; reversed ranges, empty labels and overlapping manual rules fail explicitly. Ordered overlap between manual and generated built-in dates remains allowed so manual-first precedence works as intended. The optional `label` is shown in the daily-card footer.

## Activity bands

Working time and coffee use the same six threshold bands: zero, under 4, 4–6, 6–8, 8–10 and 10-plus. Working time is displayed in hours; coffee uses the same thresholds as counts. The combination produces 36 normal activity states.

## Component hardening

The alpha component includes regression coverage for work and coffee bucket boundaries, strict Academic API payload validation, duplicate and incomplete daily data, special-date validation and precedence, New Year API availability boundaries, Europe/Amsterdam DST transitions, display helpers and deterministic asset resolution. The API loader does not request a future calendar year that the upstream RPC rejects; fixed and manual special dates can still resolve across the full displayed week.

```bash
npm run test
npm run check
```

`npm run check` validates the PNG masters, lints, type-checks and runs the unit test suite.

## Release documentation

`CHANGELOG.md` contains the technical record. `lib/releases.ts` contains the shorter reader-facing release notes shown on the demonstration page.

## Intended integration

The PoC is designed for eventual use in the Academic Website Home page, but integration is intentionally out of scope for this repository until the state model, visual language and special-date behaviour are approved.

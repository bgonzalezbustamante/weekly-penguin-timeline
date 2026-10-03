# Weekly Penguin Timeline

**v0.1.0-beta.1 "Frozen Ridge" — in development**

A standalone proof-of-concept for a reusable Next.js weekly timeline component. It converts public daily working-time and coffee data into one Oxford-colour, kawaii-style penguin state per day.

This repository is intentionally separate from `academic-website`. Development and review happen here before any future integration.

## What the PoC does

- Reads `get_public_work_analytics(year)` from the Research Dashboard Academic API.
- Reads the privacy-safe `list_public_availability(year)` resource for Winter/Summer holidays, trips and generic unavailable periods.
- Uses live daily `net_minutes` and `coffee_count`; there is no built-in activity-data fallback.
- Maps public availability to the existing timeline states without exposing private Planning records or sickness reasons/notes.
- Resolves six working-time states: `0h`, `<4h`, `4–6h`, `6–8h`, `8–10h`, and `10h+`.
- Resolves six coffee states: `0`, `<4`, `4–6`, `6–8`, `8–10`, and `10+`.
- Produces 36 normal combined activity states.
- Uses a praying penguin on Sundays.
- Supports toggleable fixed Catholic celebrations that reuse the Sunday illustration with celebration-specific labels.
- Supports manual overrides for Sunday-style holidays, winter holiday, summer holiday, trip, and sick dates.
- Uses the normal activity state on Saturdays when work or coffee is recorded; zero-work/zero-coffee Saturdays use `canonical-couple.png` instead.
- Uses `canonical-couple.png` for upcoming Saturdays; special-date overrides retain priority over every Saturday rule.
- Treats future dates as provisional rather than falsely displaying zero activity: Monday–Friday use the dedicated working-day scene, Saturday uses the canonical couple scene, and Sunday uses the Sunday scene; future illustrations remain visually provisional.
- Paginates the weekly timeline across a fixed nine-week window: four weeks before, the current week, and four weeks after.
- Marks the current day as provisional with “so far”.
- Uses the Academic Website Oxford palette and typography hierarchy.
- Includes an interactive state tester for inspecting any work/coffee combination.

## Architecture

The proof-of-concept separates:

1. `lib/work-analytics.ts` and `lib/work-data.ts` — work-analytics RPC adapter and strict runtime validation.
2. `lib/availability.ts` and `lib/availability-data.ts` — public-availability RPC adapter and strict runtime validation.
3. `lib/date-utils.ts` and `lib/special-date-rules.ts` — calendar-date and override-rule validation.
4. `lib/timeline.ts` — date, bucket and override resolution.
5. `public/penguins/canonical-baseline.png` — approved canonical mascot asset.
6. `lib/penguin-assets.ts` — deterministic mapping from resolved state to approved image asset.
7. `public/penguins/states/` — 36 validated activity PNG masters, five validated special-state PNG masters, the dedicated `working-day.png` future-workday master, and `canonical-couple.png` for Saturdays.
8. `scripts/penguin-assets.mjs` — asset-integrity validation and incremental WebP generation.
9. `components/penguin-sprite.tsx` — lightweight renderer for the generated WebP runtime asset.
10. `components/weekly-penguin-timeline.tsx` — reusable seven-day presentation with nine-week client-side pagination.
11. `components/penguin-state-tester.tsx` — interactive state inspector.
12. `components/penguin-state-gallery.tsx` — complete visual QA matrix for the 36 normal states and five special states.
13. `content/special-dates.ts` — manual overrides, public-availability mapping and toggleable fixed Catholic celebrations.
14. `tests/` — API-contract, date-rule, boundary, timezone and asset-resolution regression tests.
15. `lib/releases.ts` and `CHANGELOG.md` — readable and technical release documentation.
16. `app/page.tsx` — demonstration page only.

That separation is deliberate: the canonical mascot remains the immutable visual ground truth, while each approved state is a complete derived image rather than a runtime SVG composition. The validated PNG files remain the source masters. Development and production builds generate ignored WebP derivatives for runtime delivery, so optimisation never overwrites the approved images. State resolution remains independent of presentation, allowing the timeline to move into another Next.js application without retaining the PoC shell.

## Local setup

Requires Node.js 22 or later.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Populate:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The publishable key is used only with curated anonymous-safe RPCs. Work analytics are validated for the requested year, annual aggregates, complete daily coverage, unique dates and non-negative integer daily metrics. Public availability is validated against the controlled `winter_holiday`, `summer_holiday`, `trip` and `unavailable` vocabulary, exact response fields, real in-year date ranges, duplicate ranges and the required generic `Unavailable` privacy label. If either required Academic API resource cannot be loaded or violates its contract, the timeline fails closed instead of silently substituting fixture data or omitting availability.

## Penguin asset pipeline

The 44 PNG masters are validated before development and production builds: one canonical baseline, 36 normal activity states, five special states, one upcoming working-day state, and one Saturday couple state. Validation checks filenames, PNG structure, minimum dimensions and file integrity; transparency is reported as an additional diagnostic.

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

Precedence is: manual special date → enabled fixed Catholic date → public availability → Saturday/Sunday/future-day rule → normal activity state. Overlapping public availability ranges are allowed; when more than one applies to a day, generic `unavailable` takes priority over `trip`, followed by Winter/Summer holiday states. Manual rules are validated as real calendar dates and ranges; reversed ranges, empty labels and ambiguous manual overlaps fail explicitly. Public `unavailable` remains labelled `Unavailable` in the UI; private sickness reasons and notes are never consumed by this repository.

The local fixed Catholic-date set is transitional. Once `bgonzalezbustamante/catholic-calendar` is ready for consumption, the intended direction is to use it as the Catholic calendar source and then reassess whether manual overrides and `content/special-dates.ts` can be deprecated.

## Activity bands

Working time and coffee use the same six threshold bands: zero, under 4, 4–6, 6–8, 8–10 and 10-plus. Working time is displayed in hours; coffee uses the same thresholds as counts. The combination produces 36 normal activity states.

## Component hardening

The current component includes regression coverage for work and coffee bucket boundaries, strict work-analytics and public-availability payload validation, duplicate/incomplete data, special-date validation and precedence, active/free/upcoming Saturday behaviour, weekday/Sunday state selection, the nine-week pagination window, New Year API boundaries, Europe/Amsterdam DST transitions, display helpers and deterministic asset resolution. Work analytics are requested only for supported years, while public availability can also cover the future calendar year reached by the nine-week browser.

```bash
npm run test
npm run check
```

`npm run check` validates the PNG masters, lints, type-checks and runs the unit test suite.

## Integration

For integration into another Next.js application, use a source-level transplant rather than an iframe or runtime dependency on the standalone deployment. The same approach applies to `bgonzalezbustamante/academic-website`.

For a Home-page integration:

1. Move `components/weekly-penguin-timeline.tsx` and `components/penguin-sprite.tsx`.
2. Move the timeline support modules: `lib/timeline.ts`, `lib/date-utils.ts`, `lib/work-data.ts`, `lib/availability-data.ts`, `lib/special-date-rules.ts`, `lib/penguin-assets.ts`, `content/special-dates.ts`, and the relevant timeline types.
3. Reuse an existing public Supabase client plus the `get_public_work_analytics(year)` and `list_public_availability(year)` adapters when the receiving application already has them, rather than introducing a second API connection. Bring the strict response validation from this repository with the component.
4. Copy the approved penguin PNG masters and the asset-generation script. Merge penguin asset generation into any existing `predev`/`prebuild` workflow rather than replacing other build preparation tasks.
5. Port only the Weekly timeline CSS and map the PoC colour variables to the receiving application's design tokens. For `academic-website`, map them to its existing Oxford variables.
6. Build the nine-week window on the host page and pass the resulting `weeks` into `WeeklyPenguinTimeline`.

The standalone hero, state tester, visual QA matrix, release notes, and footer are development/demo surfaces and do not need to be copied unless they are separately useful in the receiving application.

## Release documentation

`CHANGELOG.md` contains the technical record. `lib/releases.ts` contains the shorter reader-facing release notes shown on the demonstration page. Both are kept aligned for public releases.

## Licensing

This repository uses separate licences by material type:

- Source code: MIT.
- Project documentation: Creative Commons Attribution 4.0 International (CC BY 4.0).
- Original penguin artwork in `public/penguins/`, including generated derivatives: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
- Third-party assets and branding are excluded from those grants and remain subject to their respective rights holders' terms. This includes `app/icon.png`, which uses Leiden University branding to match the Academic Website.

See `LICENSING.md` for the licence map, with the applicable terms and scope in `LICENSE`, `LICENSE-DOCUMENTATION.md`, `LICENSE-ARTWORK.md`, and `THIRD_PARTY_NOTICES.md`.

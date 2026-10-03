# Weekly Penguin Timeline

**v0.1.0-beta.1 "Frozen Ridge" — in development**

A standalone proof-of-concept for a reusable Next.js weekly timeline component. It converts public daily working-time and coffee data into one Oxford-colour, kawaii-style penguin state per day.

This repository is intentionally separate from `academic-website`. Development and review happen here before any future integration.

## What the PoC does

- Reads `get_public_work_analytics(year)` from the Research Dashboard Academic API.
- Reads the privacy-safe `list_public_availability(year)` resource for Winter/Summer holidays, trips and generic unavailable periods.
- Reads `get_public_teaching_settings()`, which exposes only the owner-level `teaching_season_active` boolean.
- Uses live daily `net_minutes` and `coffee_count`; there is no built-in activity-data fallback.
- Maps public availability to the existing timeline states without exposing private Planning records or sickness reasons/notes.
- Resolves six working-time states: `0h`, `<4h`, `4–6h`, `6–8h`, `8–10h`, and `10h+`.
- Resolves six coffee states: `0`, `<4`, `4–6`, `6–8`, `8–10`, and `10+`.
- Produces 36 normal combined activity states.
- Uses a praying penguin on Sundays.
- Resolves selected Catholic celebrations through `@bgonzalezbustamante/catholic-calendar@0.1.0-alpha.1`, reusing the Sunday illustration with package-provided observed dates and concise repository-specific labels.
- Supports manual overrides for Sunday-style holidays, winter holiday, summer holiday, trip, and sick dates.
- On Saturdays, recorded work or coffee always uses the normal activity state, even during Teaching season.
- When there is no recorded Saturday activity and `teaching_season_active` is true, use `teaching.png` — including the current Saturday and future Saturdays.
- When Teaching season is inactive, zero-work/zero-coffee and future Saturdays use `canonical-couple.png`; manual, Catholic and public-availability overrides retain priority over every Saturday rule.
- Treats future dates as provisional rather than falsely displaying zero activity: Monday–Friday use the dedicated working-day scene, Saturday uses Teaching when the season flag is active or the canonical couple otherwise, and Sunday uses the Sunday scene; future illustrations remain visually provisional.
- Browses roughly three months before and after the current date with a separate highlighted-day and seven-day-window model. On first load, the timeline displays the current Monday–Sunday week while today is highlighted in Oxford blue and centred in the nine-date paginator. Previous day/Next day keep the rolling one-day behaviour. The single Current day shortcut restores this initial state. First/Last retain their range-boundary behaviour. Previous week/Next week switch to the previous or next canonical Monday–Sunday week, preserve the highlighted weekday, and centre the newly highlighted date in the nine-date paginator whenever the range permits. The lower row remains First + Previous week on the left and Next week + Last on the right.
- Marks the current day as provisional with “so far”.
- Uses the Academic Website Oxford palette and typography hierarchy.
- Includes an interactive state tester for inspecting any work/coffee combination.

## Architecture

The proof-of-concept separates:

1. `lib/work-analytics.ts` and `lib/work-data.ts` — work-analytics RPC adapter and strict runtime validation.
2. `lib/availability.ts` and `lib/availability-data.ts` — public-availability RPC adapter and strict runtime validation.
3. `lib/teaching-settings.ts` and `lib/teaching-settings-data.ts` — Teaching-season RPC adapter and strict singleton-boolean validation.
4. `lib/date-utils.ts` and `lib/special-date-rules.ts` — calendar-date and override-rule validation.
5. `lib/catholic-calendar.ts` — adapter from the Catholic Calendar package to the timeline’s selected Sunday-style celebration states.
6. `lib/timeline.ts` — date, bucket and override resolution.
7. `public/penguins/canonical-baseline.png` — approved canonical mascot asset.
8. `lib/penguin-assets.ts` — deterministic mapping from resolved state to approved image asset.
9. `public/penguins/states/` — 36 validated activity PNG masters, five validated special-state PNG masters, `working-day.png`, `canonical-couple.png`, and `teaching.png` contextual masters.
10. `scripts/penguin-assets.mjs` — asset-integrity validation and incremental WebP generation.
11. `components/penguin-sprite.tsx` — lightweight renderer for the generated WebP runtime asset.
12. `components/weekly-penguin-timeline.tsx` — reusable rolling seven-day presentation with a ±3-month browser, daily stepping and compact date-start buttons.
13. `components/penguin-state-tester.tsx` — interactive state inspector.
14. `components/penguin-state-gallery.tsx` — visual QA matrix for the 36 normal states plus special and contextual states.
15. `content/special-dates.ts` — manual/local presentation overrides, recurring Christmas Eve and public-availability mapping; Catholic observance dates themselves come from the package.
16. `tests/` — API-contract, date-rule, boundary, timezone and asset-resolution regression tests.
17. `lib/releases.ts` and `CHANGELOG.md` — readable and technical release documentation.
18. `app/page.tsx` — demonstration page only.

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

The publishable key is used only with curated anonymous-safe RPCs. Work analytics are validated for the requested year, annual aggregates, complete daily coverage, unique dates and non-negative integer daily metrics. Public availability is validated against the controlled `winter_holiday`, `summer_holiday`, `trip` and `unavailable` vocabulary, exact response fields, real in-year date ranges, duplicate ranges and the required generic `Unavailable` privacy label. Public Teaching settings must contain exactly one row with exactly one boolean field, `teaching_season_active`. If any required Academic API resource cannot be loaded or violates its contract, the timeline fails closed rather than silently guessing Teaching season or omitting availability.

## Penguin asset pipeline

The 45 PNG masters are validated before development and production builds: one canonical baseline, 36 normal activity states, five special states, one upcoming working-day state, one Saturday couple state, and one Teaching state. Validation checks filenames, PNG structure, minimum dimensions and file integrity; transparency is reported as an additional diagnostic.

`npm run dev` and `npm run build` automatically create WebP runtime derivatives when they are missing or older than their PNG source. Generated WebP files are ignored by Git and the PNG masters are never modified.

Useful commands:

```bash
npm run assets:validate
npm run assets:generate
npm run assets:generate:force
```

If a PNG master is replaced while the development server is already running, run `npm run assets:generate` and refresh the page. Because the renderer serves the pre-generated WebP directly, it does not rely on Next.js image-optimiser cache entries.

## Special dates

Edit `content/special-dates.ts` for timeline-only manual or local presentation overrides. Catholic observance dates are no longer maintained there: the timeline consumes the pinned package `@bgonzalezbustamante/catholic-calendar@0.1.0-alpha.1` through `lib/catholic-calendar.ts`.

The timeline deliberately selects a subset of package observances rather than treating every Catholic Calendar entry as a special penguin state. It currently consumes Palm Sunday, Holy Thursday, Good Friday, Holy Saturday, Easter Sunday, Divine Mercy Sunday, Ascension, Pentecost, Corpus Christi, Assumption, All Saints, All Souls, the Immaculate Conception and Christmas. The package supplies calendar semantics and observed dates, including transfers; this repository owns the compact display labels `Palm Sunday`, `Holy Thursday`, `Good Friday`, `Holy Saturday`, `Easter Sunday`, `Divine Mercy`, `Ascension`, `Pentecost`, `Corpus Christi`, `Assumption`, `All Saints`, `All Souls`, `Immaculate` and `Christmas`. The 1 January observance remains outside the Weekly Timeline’s selected subset.

Christmas Eve is not a discrete observance in the Catholic Calendar package, so `special-dates.ts` retains it as one local recurring Sunday-style presentation rule. Manual exact dates and inclusive ranges remain supported for future project-specific exceptions:

```ts
{
  date: '2027-07-18',
  type: 'sunday',
  label: 'Local patronal feast',
}

{
  from: '2026-12-21',
  to: '2027-01-03',
  type: 'winter-holiday',
  label: 'Winter holiday',
}
```

Precedence is: manual/local special date → selected package-backed Catholic celebration → public availability → Saturday/Sunday/future-day rule → normal activity state. Inside the Saturday rule, recorded activity takes priority first; when no activity is recorded, an active Teaching season selects `teaching.png`; otherwise the canonical couple is used. Overlapping public availability ranges are allowed; when more than one applies to a day, generic `unavailable` takes priority over `trip`, followed by Winter/Summer holiday states. Manual rules are validated as real calendar dates and ranges; reversed ranges, empty labels and ambiguous manual overlaps fail explicitly. Public `unavailable` remains labelled `Unavailable` in the UI; private sickness reasons and notes are never consumed by this repository.

## Activity bands

Working time and coffee use the same six threshold bands: zero, under 4, 4–6, 6–8, 8–10 and 10-plus. Working time is displayed in hours; coffee uses the same thresholds as counts. The combination produces 36 normal activity states.

## Component hardening

The current component includes regression coverage for work and coffee bucket boundaries, strict work-analytics, public-availability and Teaching-settings validation, Catholic Calendar package selection and transfers, duplicate/incomplete data, special-date validation and precedence, Teaching/free/active/upcoming Saturday behaviour, weekday/Sunday state selection, the ±3-month rolling seven-day browser, New Year API boundaries, Europe/Amsterdam DST transitions, display helpers and deterministic asset resolution. Work analytics are requested only for supported years, while public availability can also cover a future calendar year reached by the three-month browser.

```bash
npm run test
npm run check
```

`npm run check` validates the PNG masters, lints, type-checks and runs the unit test suite.

## Integration

For integration into another Next.js application, use a source-level transplant rather than an iframe or runtime dependency on the standalone deployment. The same approach applies to `bgonzalezbustamante/academic-website`.

For a Home-page integration:

1. Move `components/weekly-penguin-timeline.tsx` and `components/penguin-sprite.tsx`.
2. Move the timeline support modules: `lib/timeline.ts`, `lib/date-utils.ts`, `lib/work-data.ts`, `lib/availability-data.ts`, `lib/teaching-settings-data.ts`, `lib/special-date-rules.ts`, `lib/catholic-calendar.ts`, `lib/penguin-assets.ts`, `content/special-dates.ts`, and the relevant timeline types; install the pinned Catholic Calendar package alongside them.
3. Reuse an existing public Supabase client plus the `get_public_work_analytics(year)`, `list_public_availability(year)`, and `get_public_teaching_settings()` adapters when the receiving application already has them. Bring the strict response validation from this repository with the component.
4. Copy the approved penguin PNG masters and the asset-generation script. Merge penguin asset generation into any existing `predev`/`prebuild` workflow rather than replacing other build preparation tasks.
5. Port only the Weekly timeline CSS and map the PoC colour variables to the receiving application's design tokens. For `academic-website`, map them to its existing Oxford variables.
6. Build the ±3-month source-week range on the host page and pass the resulting `weeks` into `WeeklyPenguinTimeline`; the component derives the rolling seven-day window and daily navigation client-side.

The standalone hero, state tester, visual QA matrix, release notes, and footer are development/demo surfaces and do not need to be copied unless they are separately useful in the receiving application.

## Release documentation

`CHANGELOG.md` contains the technical record. `lib/releases.ts` contains the shorter reader-facing release notes shown on the demonstration page. The Release notes component exposes every recorded version, newest first, with one release per pagination page. Both sources are kept aligned for public releases.

## Licensing

This repository uses separate licences by material type:

- Source code: MIT.
- Project documentation: Creative Commons Attribution 4.0 International (CC BY 4.0).
- Original penguin artwork in `public/penguins/`, including generated derivatives: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
- Third-party assets and branding are excluded from those grants and remain subject to their respective rights holders' terms. This includes `app/icon.png`, which uses Leiden University branding to match the Academic Website.

See `LICENSING.md` for the licence map, with the applicable terms and scope in `LICENSE`, `LICENSE-DOCUMENTATION.md`, `LICENSE-ARTWORK.md`, and `THIRD_PARTY_NOTICES.md`.

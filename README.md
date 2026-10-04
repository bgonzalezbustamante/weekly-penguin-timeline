# Weekly Penguin Timeline

**v0.1.0-beta.2 "Ivory Falcon" — in development**

A standalone proof-of-concept for a reusable Next.js weekly timeline component. It converts public daily working-time and coffee data into one Oxford-colour, kawaii-style penguin state per day.

This repository is intentionally separate from `academic-website`. Development and review happen here before any future integration.

## What the PoC does

- Builds a live seven-day penguin timeline from public work, coffee, availability, conference and Teaching-setting data exposed by the Research Dashboard Academic API.
- Resolves 36 normal activity states from six work bands × six coffee bands, plus contextual states for Sunday, Teaching Saturdays, Free Saturdays, Conference, Trip, Winter/Summer holidays and Unavailable periods.
- Uses actual public conference dates for the Conference state. When a personally attended conference has `involves_trip = true`, only the day before and day after use Trip; Conference wins over overlapping travel.
- Uses `@bgonzalezbustamante/catholic-calendar@0.1.0-alpha.1` for selected Catholic observances and transfers, while retaining concise Timeline labels and a local recurring Christmas Eve rule.
- Keeps Saturday history conservative: recorded activity uses the normal matrix; historical 0h/0-coffee Saturdays use Free Saturdays; the current/future Saturday uses Teaching only when the current Teaching-season flag is active.
- Treats future dates as provisional, with dedicated working-day and weekend states rather than pretending that missing future activity is zero activity.
- Browses roughly three months before and after today with daily stepping, canonical week jumps, Current day, First and Last controls. On mobile, day controls are separated from a horizontally scrollable date rail, while week and range shortcuts are stacked below.
- Fails closed when required public API data are unavailable or malformed; no private Planning notes, sickness reasons or source identifiers are consumed.
- Includes a state tester, a complete visual-QA matrix and readable release notes for development and review.

## Architecture

The proof-of-concept keeps data access, validation, state resolution and presentation separate:

1. **Academic API adapters** — `lib/work-analytics.ts`, `lib/availability.ts`, `lib/conferences.ts` and `lib/teaching-settings.ts`.
2. **Runtime validation** — the corresponding `*-data.ts` modules plus `lib/date-utils.ts` and `lib/special-date-rules.ts`.
3. **Calendar/state composition** — `lib/catholic-calendar.ts`, `content/special-dates.ts` and `lib/timeline.ts`.
4. **Asset resolution** — `lib/penguin-assets.ts`, the validated PNG masters under `public/penguins/`, and `scripts/penguin-assets.mjs` for WebP generation.
5. **Presentation** — `PenguinSprite`, `WeeklyPenguinTimeline`, the state tester and the visual-QA gallery.
6. **Release documentation** — `CHANGELOG.md` for the technical record and `lib/releases.ts` for short reader-facing notes.

The canonical mascot and approved PNG state images are the visual source of truth. Generated WebP files are runtime derivatives and remain ignored by Git.

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

The publishable key is used only with curated anonymous-safe RPCs. Work analytics, public availability, conference presentations and Teaching settings are validated before rendering. Public availability projections are expected to be unique; an exact repeated `type`/date-range/label tuple fails validation. Conference dates come from the conference RPC rather than being inferred from availability ranges. If any required source fails validation or cannot be loaded, the Timeline fails closed.

## Penguin asset pipeline

The 46 PNG masters are validated before development and production builds: one canonical baseline, 36 activity states, six special states, one upcoming working-day state, one Saturday couple state and one Teaching state. Validation checks filenames, PNG structure, minimum dimensions, integrity and transparency.

`npm run dev` and `npm run build` automatically create WebP runtime derivatives when they are missing or older than their PNG source. Generated WebP files are ignored by Git and the PNG masters are never modified.

Useful commands:

```bash
npm run assets:validate
npm run assets:generate
npm run assets:generate:force
```

If a PNG master is replaced while the development server is already running, run `npm run assets:generate` and refresh the page. Because the renderer serves the pre-generated WebP directly, it does not rely on Next.js image-optimiser cache entries.

## Special dates

`content/special-dates.ts` remains the place for Timeline-only manual/local presentation overrides. Catholic observance dates themselves come from the pinned Catholic Calendar package.

The package-backed Timeline subset is: **Palm Sunday, Holy Thursday, Good Friday, Holy Saturday, Easter Sunday, Divine Mercy, Ascension, Pentecost, Corpus Christi, Assumption, All Saints, All Souls, Immaculate and Christmas**. Christmas Eve remains a local recurring rule, and 1 January remains outside the selected subset.

Current precedence is:

`manual/local → Catholic celebration → Unavailable → Conference → Trip → Winter/Summer holiday → Saturday/Sunday/future-day rule → normal activity`

Multiple presentations at the same conference may legitimately map to the same public conference dates and are coalesced visually. Public availability itself guarantees unique projections, so the Timeline validates rather than normalises exact duplicates. Distinct overlapping conferences combine their labels with ` · `. Historical 0h/0-coffee Saturdays never inherit the current Teaching-season flag.

## Activity bands

Working time and coffee use the same six threshold bands: zero, under 4, 4–6, 6–8, 8–10 and 10-plus. Working time is displayed in hours; coffee uses the same thresholds as counts. The combination produces 36 normal activity states.

## Verification

The automated suite covers work/coffee boundaries, API contracts, conference/travel overlap, Saturday Teaching boundaries, Catholic Calendar transfers, date precedence, navigation windows, New Year/DST behaviour and deterministic asset resolution.

```bash
npm run test
npm run check
npm run build
```

`npm run check` validates the PNG masters, lints, type-checks and runs the unit tests.

## Integration

For integration into another Next.js application, use a source-level transplant rather than an iframe or runtime dependency on the standalone deployment. The same approach applies to `bgonzalezbustamante/academic-website`.

For a Home-page integration:

1. Move `components/weekly-penguin-timeline.tsx` and `components/penguin-sprite.tsx`.
2. Move the timeline support modules for data validation, conference/availability composition, Catholic Calendar integration, state resolution and asset mapping; install the pinned Catholic Calendar package alongside them.
3. Reuse an existing public Supabase client plus the work-analytics, availability, conference and Teaching-setting RPC adapters. Bring the strict response validation with the component.
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

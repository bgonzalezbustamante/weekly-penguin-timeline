# CHANGELOG

## v0.1.0-beta.1 "Frozen Ridge" (in development)

### Summary

- Opened the first beta development line after the tagged Bold Cipher alpha.
- Added the canonical couple illustration for free and upcoming Saturdays while retaining normal activity states on active Saturdays.
- Integrated the Academic API privacy-safe availability layer for Winter/Summer holidays, trips and generic unavailable periods.
- Preserved manual special-date overrides as the highest-priority calendar rule.

### Code changes

`penguin visual system`

- Registered `public/penguins/states/canonical-couple.png` as a required validated PNG master.
- Added automatic WebP generation for `canonical-couple.webp`.
- Added deterministic Saturday asset resolution to `lib/penguin-assets.ts`.
- Registered `public/penguins/states/teaching.png` as a validated contextual PNG master with generated WebP output.

`timeline behaviour`

- Added dedicated `teaching` and `saturday` modes for contextual Saturday rendering.
- Non-future Saturdays with recorded work or coffee always use the normal activity matrix, even while Teaching season is active.
- Future Saturdays use the Teaching illustration when `teaching_season_active` is true and the canonical couple otherwise.
- Non-future zero-work/zero-coffee Saturdays use the canonical couple illustration.
- Manual, Catholic and public-availability states continue to take priority over Saturday defaults.
- Future Saturdays retain the existing provisional/dimmed presentation.
- Expanded the weekly browser from four weeks either side to a dynamic ±3-month date window while retaining a compact nine-button pagination window with Older/Newer controls and no horizontal pagination scroll.
- Reordered the seven contextual gallery states to Sunday, Teaching Saturdays, Free Saturdays, Trip, Winter holiday, Summer holiday and Unavailable, keeping them in one horizontal row.

`Academic API`

- Added a `list_public_availability(year)` adapter alongside the existing work-analytics RPC.
- Added `get_public_teaching_settings()` consumption with strict validation of exactly one row containing only the `teaching_season_active` boolean.
- Added strict runtime validation for the public availability contract: exact fields, controlled type vocabulary, real in-year ranges, start/end ordering, duplicate-range rejection and the mandatory generic `Unavailable` label.
- Mapped `winter_holiday` → `winter-holiday`, `summer_holiday` → `summer-holiday`, `trip` → `trip`, and `unavailable` → a generic unavailable timeline mode.
- Source precedence is manual override → fixed Catholic celebration → public availability → calendar defaults → normal activity. Overlapping public availability ranges are allowed; when more than one applies to a day, `unavailable` takes priority over `trip`, followed by holiday states.
- Within the Saturday calendar-default rule, recorded non-future activity wins first; future Saturdays use `teaching.png` when Teaching season is active and the canonical couple otherwise; non-future zero-work/zero-coffee Saturdays use the couple.
- The public `unavailable` state keeps the user-facing label `Unavailable` and does not consume sickness reasons, notes or other private Planning fields.
- The existing sick-state artwork is reused for the generic unavailable mode; manual `sick` overrides remain supported separately.
- Work analytics and public availability are loaded together and the timeline fails closed if either required RPC is unavailable or violates its contract.
- Public availability can be requested for future calendar years reached by the ±3-month browser, within the upstream API's current-year-plus-five boundary.

`testing and release metadata`

- Added regression coverage for Teaching-season, active, free and upcoming Saturday precedence and the Saturday assets.
- Added regression coverage for the exact ±3-month-to-week pagination calculation and invalid month-window inputs.
- Added Teaching-settings contract tests for singleton shape, exact fields and boolean typing.
- Added public-availability validator tests for controlled types, exact fields, malformed/reversed/cross-year ranges, privacy labels and duplicates.
- Added precedence tests for manual overrides → fixed Catholic dates → public availability and coverage for the generic unavailable state.
- Added regression coverage confirming that overlapping public availability ranges are accepted.
- Bumped application and lockfile metadata to `0.1.0-beta.1`.
- Marked Frozen Ridge as in development in the README and reader-facing release notes.
- Documented the intended future replacement of the local fixed Catholic-date layer with `bgonzalezbustamante/catholic-calendar`, followed by reassessment of manual overrides and `content/special-dates.ts`.

### Release status

- Frozen Ridge beta.1 is in development.
- Release date: TBC.

## v0.1.0-alpha.1 "Bold Cipher" — 2 October 2026

### Summary

- Established the first named alpha release of Weekly Penguin Timeline.
- Reworked the penguin visual system towards a softer kawaii illustration while retaining the Academic Website colour palette.
- Added live state inspection and started formal release documentation.

### Code changes

`penguin visual system`

- Replaced the harder-edged sprite treatment with a softer kawaii SVG illustration using the Academic Website Oxford blue, dark blue, coral, aqua, sky blue, off-white and neutral colours.
- Refined the character towards the supplied glossy kawaii reference with a rounded chibi body, oversized glasses, larger glossy eyes, forehead highlights, blush and stronger dark outlines.
- Rebuilt the shared baseline mascot around a wider plush silhouette, heart-like white face patches, a brighter blue belly, thicker spectacle frames, a smaller beak, an open smiling mouth, stronger head gloss and softer flippers/feet. All normal and special states now inherit this same baseline character without changing the 36-state logic.
- Reworked the baseline a second time after visual comparison with the supplied reference: the head now dominates the silhouette, the white face lobes form a clearer central V, the glasses are wider and more rectangular, the eyes are larger and more circular, the body is shorter and rounder, and the tail/flippers/feet follow the reference proportions more closely.
- Replaced that baseline entirely with a from-scratch mascot drawing. The new shared character uses a broader glossy head, stronger dark outline, larger white facial lobes, more dominant square glasses, larger highlighted eyes, a compact blue-and-white body, small coral feet and a clearer smiling beak/mouth treatment. Activity and special-state layers remain unchanged.
- Retired the hand-authored baseline shell and face from the runtime renderer after approving a canonical glossy mascot image.
- Replaced the incomplete low-quality SVG wrapper assets with the user-supplied `public/penguins/canonical-baseline.png`. The PNG is the immutable mascot ground truth.
- Replaced runtime-drawn work, coffee, stress and special-state SVG overlays with the complete approved PNG asset set: 36 normal work × coffee states and five special states.
- Added `lib/penguin-assets.ts` as the deterministic asset resolver. The canonical baseline is used directly for the 0h + 0 coffee state and for upcoming Saturdays; `working-day.png` is used for upcoming Monday–Friday dates.
- Simplified `PenguinSprite` to render resolved approved assets through Next.js Image while retaining PNG masters in the repository.
- Marked the complete 36-state activity matrix, five special-state images and dedicated upcoming working-day image as the validated visual set for alpha.1.
- Added automated integrity checks for the canonical baseline and all 42 state PNG masters, including the dedicated upcoming working-day scene, filename coverage, PNG structure, minimum dimensions and transparency diagnostics.
- Added incremental WebP generation for development and production builds. PNG masters remain unchanged and generated WebP runtime assets are ignored by Git.
- Switched runtime rendering to the generated WebP files and disabled redundant Next.js image reprocessing for these already-optimised assets.
- Strengthened work-intensity progression from resting through notes, reading and laptop work to book stacks, a measuring tape and overloaded high-work scenes inspired by the supplied reference.
- Expanded coffee to six matching intervals and up to five clear mugs, with visible handles, coffee surfaces, saucers and steam.
- Reworked special illustrations so each state has a distinct scene: prayer and cross motif for Sunday; hat, scarf, snow and present for winter holiday; sunglasses, sun, beach ball and cold drink for summer holiday; suitcase, ticket and aircraft for trip; and blanket, thermometer, tissue box and cooling pack for sickness.
- Added combined stress cues so high working time and/or coffee levels produce wider eyes, stronger blush, sweat, agitation marks, loose papers and denser desk clutter.

`timeline presentation`

- Moved Sunday and manual special-date labels from the body of the daily card to its footer.
- Added a small note below the Sunday card in the state matrix clarifying that the icon is also used for major, widely observed Catholic celebrations.
- Kept future days distinct from zero-activity days; future Monday–Friday dates use `working-day.png`, Saturdays use the canonical baseline, Sundays retain the Sunday scene, all future images are dimmed, and special dates retain priority.
- Expanded the introductory copy to use the full available content width.
- Reduced the vertical gap between the hero and the Seven-day view.
- Allowed the Penguin state tester and visual-QA introductory copy to use the full section width.
- Formatted timeline dates in British style, for example `28 Sept 2026`.
- Renamed the timeline legend category from `Manual override / Sunday` to `Special state`.
- Added weekly pagination across nine pages: four weeks before the current week, the current week, and four weeks after, with direct week buttons plus Older/Newer controls.
- Kept Today and Upcoming semantics anchored to the real current date while browsing adjacent weeks.

`Academic API`

- Removed all built-in demo work and coffee data.
- Weekly timeline data now come only from `get_public_work_analytics(year)`.
- Added an explicit live-data-unavailable state rather than silently substituting fixture values.
- Marked the demonstration page as dynamically rendered so production builds do not require runtime Academic API credentials.
- Simplified the visible data-source label to Academic API, with a green point when the live request succeeds and a muted red point when the API is unavailable.
- Linked the Academic API status label to `https://dashboard.bgonzalezbustamante.com/api`.
- Added strict runtime validation for the public work-analytics payload: expected year, annual averages, valid/unique calendar dates, non-negative integer daily metrics and complete 365/366-day coverage.
- Prevented New Year-crossing weeks from requesting a future calendar year that the upstream Academic API rejects, while retaining both displayed calendar years for special-date resolution.
- Expanded API-year discovery to the nine-week pagination window, fetching previous-year data when required while never requesting unsupported future years.

`interactive state testing`

- Added a Penguin state tester between the weekly timeline and architecture cards.
- Added working-hours and coffee sliders that reuse the production state resolver.
- Displayed the resolved work and coffee buckets while removing the redundant internal state identifier from the tester UI.
- Standardised work and coffee into six matching bands: zero, under 4, 4–6, 6–8, 8–10 and 10-plus, producing 36 normal combinations.
- Added mutually exclusive tick-box controls for Sunday, winter holiday, summer holiday, trip and sickness states so special illustrations can be tested directly.
- Added a complete visual QA matrix showing all 36 normal activity states and all five special-state assets on one page.
- Replaced the fieldset legend treatment with an in-panel Special state heading so the title no longer overlaps the control border.
- Extended manual special dates with a labelled `sunday` type so Christian holidays can reuse the praying mascot independently of weekday.
- Ensured a custom label on a manual `sunday` override replaces the default “Sunday” footer label, while automatic Sundays continue to display “Sunday”.
- Added a `ENABLE_CATHOLIC_FIXED_DATES` switch and recurring fixed Catholic dates for Assumption, All Saints, All Souls, Immaculate Conception, Christmas Eve and Christmas Day; 1 January remains excluded.
- Applied precedence as manual special date → enabled fixed Catholic date → future weekday/weekend rule or automatic Sunday → normal activity state.


`component hardening`

- Added Vitest regression coverage for all work and coffee bucket boundaries.
- Added timeline tests for labelled Sunday-style holidays, explicit-override precedence, missing API days and future-day behaviour.
- Added regression coverage for the fixed Catholic date set, its TRUE/FALSE switch, year expansion, duplicate-year handling and manual-first precedence.
- Added runtime validation for manual special-date rules, including impossible dates, reversed ranges, empty labels and ambiguous overlaps; ordered manual-over-built-in overlap remains supported.
- Added regression coverage for Monday-to-Sunday weeks crossing New Year, British date formatting and working-time formatting.
- Added deterministic asset-resolver tests for canonical, activity, Sunday, future working-day and generic Upcoming states.
- Added regression tests for malformed/incomplete work data, duplicate daily rows, strict numeric inputs, New Year API availability and Europe/Amsterdam DST week boundaries.
- Added pagination regression coverage for the -4…+4 week window, offset resolution, current-day anchoring and cross-year API loading.
- Added the unit test suite to `npm run check` and GitHub Actions CI.

`release documentation`

- Set the application version to `0.1.0-alpha.1`.
- Added `lib/releases.ts` as the readable release-note source.
- Added a release-notes section to the demonstration page.
- Added this technical CHANGELOG.
- Expanded the reader-facing release summary to use the full release-note card width.
- Added asset validation to CI so missing or malformed mascot states fail before merge.

### Release status

- Bold Cipher alpha.1 is ready for publication as a GitHub pre-release.
- Release date: 2 October 2026.
- Release verification: all npm checks passed; Gitleaks scanned 200 commits with no leaks found.

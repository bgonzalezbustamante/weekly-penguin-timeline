# CHANGELOG

## v0.1.0-beta.2 "Summer Cedar" (in development)

### Summary

- Align the public-availability consumer with the refined Academic API contract.
- Improve mobile timeline navigation without changing desktop navigation semantics.

### Academic API contract alignment

- Enforce the API's upstream uniqueness guarantee by rejecting exact repeated public availability projections.
- Removed redundant presentation-layer deduplication from `availabilityToSpecialDates()` so uniqueness is validated at the API boundary rather than silently normalised during presentation.
- Kept same-conference presentation coalescing in the conference adapter because multiple public presentation rows remain legitimate.
- Tightened conference validation to the Public RPC v1 presentation-type vocabulary (`Conference paper`, `Keynote`, `Workshop`) and require non-empty author strings.
- Conference and Trip rendering continues to use `list_public_conference_presentations()`; public availability trip projections remain excluded from conference rendering.

### Mobile timeline navigation

- Keep the existing desktop control layout.
- On screens up to 760px, place Previous day, Current day and Next day in a dedicated three-control row with larger touch targets.
- Move the nine date buttons into a horizontally scrollable, snap-aligned rail with stable button widths.
- Automatically centre the selected date in the mobile rail when possible.
- Reflow Previous week and Next week into the primary shortcut row and visually subordinate First and Last beneath them.
- Preserve all Frozen Ridge navigation semantics: daily stepping remains daily, week navigation remains canonical Monday–Sunday navigation, and Current day restores the current-week presentation.

### Release status

- Summer Cedar beta.2 is in development.
- Release date: TBC.

## v0.1.0-beta.1 "Frozen Ridge" — 3 October 2026

### Summary

- Opened the first beta line with a broader live-data timeline, clearer Saturday behaviour and a longer browsing window.
- Added package-backed Catholic observances through `@bgonzalezbustamante/catholic-calendar@0.1.0-alpha.1`.
- Added dedicated Conference and Teaching states while retaining Free Saturday, Trip, holiday and Unavailable states.
- Kept manual/local overrides in `content/special-dates.ts` without duplicating Catholic Calendar rules.

### Penguin states and presentation

- Added `canonical-couple.png` for Free Saturdays, `teaching.png` for current/future Teaching Saturdays and `conference.png` for attended conference dates.
- Registered 46 validated PNG masters in total: one canonical baseline, 36 activity states, six special states, one working-day state, one Saturday couple state and one Teaching state.
- Expanded the contextual state gallery to eight states in two rows of four: Sunday, Teaching Saturdays, Free Saturdays, Trip, Conference, Winter holiday, Summer holiday and Unavailable.
- Kept future illustrations provisional/dimmed and preserved deterministic PNG-to-WebP asset generation.

### Timeline behaviour

- Expanded browsing to roughly three months before and after the current date.
- First load shows the current Monday–Sunday week with today highlighted. Previous/Next day move a rolling seven-day window; Current day restores the initial view; Previous/Next week jump by canonical weeks while preserving the highlighted weekday; First/Last retain range-boundary navigation.
- Recorded Saturday activity always uses the normal activity matrix. Historical 0h/0-coffee Saturdays use Free Saturdays; the current and future Saturday use Teaching only when the current Teaching-season flag is active.
- Personally attended conference dates come from `list_public_conference_presentations()`. If `involves_trip` is true, only the day before and day after use Trip.
- Multiple presentations at the same conference coalesce visually. Distinct overlapping conferences combine labels with ` · `; Conference wins over an overlapping Trip day.
- State precedence is manual/local override → package-backed Catholic celebration → Unavailable → Conference → Trip → Winter/Summer holiday → Saturday/Sunday/future-day rule → normal activity.

### Catholic Calendar

- Replaced the transitional fixed Catholic-date table with the Catholic Calendar package, including observed/transferred dates.
- Package-backed Timeline labels are: Palm Sunday, Holy Thursday, Good Friday, Holy Saturday, Easter Sunday, Divine Mercy, Ascension, Pentecost, Corpus Christi, Assumption, All Saints, All Souls, Immaculate and Christmas.
- Christmas Eve remains the sole local recurring Catholic-style presentation rule; 1 January remains outside the selected Timeline subset.

### Academic API and validation

- Added strict consumers for public availability, public conference presentations and Teaching settings alongside the existing work-analytics consumer.
- Public availability supplies Winter/Summer holidays and generic Unavailable periods. Its trip projection is not used to infer conference dates.
- The Timeline accepts repeated anonymous projections when distinct private source records can legitimately map to the same public tuple, while coalescing identical rendered states.
- The Timeline continues to fail closed when required public data are unavailable or violate their expected contract.

### Testing and release

- Added regression coverage for conference/travel resolution, overlap precedence and labels, historical/current/future Saturday boundaries, Catholic Calendar transfers, availability multiplicity, navigation, API validation and asset resolution.
- Final beta verification passed asset validation, linting, TypeScript checks, the Vitest suite, the production build and the Netlify deploy preview.
- Release date: 3 October 2026.

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

# CHANGELOG

## v0.1.0-alpha.1 "Bold Cipher" (in development)

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
- Added `lib/penguin-assets.ts` as the deterministic asset resolver. The canonical baseline is used directly for the 0h + 0 coffee state and for the dimmed Upcoming treatment.
- Simplified `PenguinSprite` to render resolved approved assets through Next.js Image, allowing runtime image optimisation while retaining PNG masters in the repository.
- Strengthened work-intensity progression from resting through notes, reading and laptop work to book stacks, a measuring tape and overloaded high-work scenes inspired by the supplied reference.
- Expanded coffee to six matching intervals and up to five clear mugs, with visible handles, coffee surfaces, saucers and steam.
- Reworked special illustrations so each state has a distinct scene: prayer and cross motif for Sunday; hat, scarf, snow and present for winter holiday; sunglasses, sun, beach ball and cold drink for summer holiday; suitcase, ticket and aircraft for trip; and blanket, thermometer, tissue box and cooling pack for sickness.
- Added combined stress cues so high working time and/or coffee levels produce wider eyes, stronger blush, sweat, agitation marks, loose papers and denser desk clutter.

`timeline presentation`

- Moved Sunday and manual special-date labels from the body of the daily card to its footer.
- Kept future days distinct from zero-activity days.
- Expanded the introductory copy to use the full available content width.
- Formatted timeline dates in British style, for example `28 Sept 2026`.
- Renamed the timeline legend category from `Manual override / Sunday` to `Special state`.

`Academic API`

- Removed all built-in demo work and coffee data.
- Weekly timeline data now come only from `get_public_work_analytics(year)`.
- Added an explicit live-data-unavailable state rather than silently substituting fixture values.
- Marked the demonstration page as dynamically rendered so production builds do not require runtime Academic API credentials.
- Simplified the visible data-source label to Academic API, with a green point when the live request succeeds and a muted red point when the API is unavailable.

`interactive state testing`

- Added a Penguin state tester between the weekly timeline and architecture cards.
- Added working-hours and coffee sliders that reuse the production state resolver.
- Displayed the resolved work bucket, coffee bucket and deterministic combined state identifier.
- Standardised work and coffee into six matching bands: zero, under 4, 4–6, 6–8, 8–10 and 10-plus, producing 36 normal combinations.
- Added mutually exclusive tick-box controls for Sunday, winter holiday, summer holiday, trip and sickness states so special illustrations can be tested directly.
- Added a complete visual QA matrix showing all 36 normal activity states and all five special-state assets on one page.
- Replaced the fieldset legend treatment with an in-panel Special state heading so the title no longer overlaps the control border.

`release documentation`

- Set the application version to `0.1.0-alpha.1`.
- Added `lib/releases.ts` as the readable release-note source.
- Added a release-notes section to the demonstration page.
- Added this technical CHANGELOG.
- Expanded the reader-facing release summary to use the full release-note card width.

### Release status

- Bold Cipher alpha.1 is in development.
- Release date: TBC.

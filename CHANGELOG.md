# CHANGELOG

## v0.1.0-alpha.1 "Bold Cipher" (in development)

### Summary

- Established the first named alpha release of Weekly Penguin Timeline.
- Reworked the penguin visual system towards a softer kawaii illustration while retaining the Academic Website colour palette.
- Added live state inspection and started formal release documentation.

### Code changes

`penguin visual system`

- Replaced the harder-edged sprite treatment with a softer kawaii SVG illustration using the Academic Website Oxford blue, dark blue, coral, aqua, sky blue, off-white and neutral colours.
- Added stronger character details including oversized rounded glasses, larger glossy eyes, blush, a compact chibi body, softer wings and small rounded feet to move closer to the supplied kawaii reference.
- Added state-specific work props: resting state, notes and pencil, open book, laptop, books plus laptop, and an overloaded high-work state.
- Reworked coffee intensity around larger, recognisable mugs with visible handles, coffee surfaces, saucers and steam so each coffee state is readable at timeline-card scale.
- Reworked special illustrations so each state has a distinct scene: prayer and cross motif for Sunday; hat, scarf, snow and present for winter holiday; sunglasses, sun, beach ball and cold drink for summer holiday; suitcase, ticket and aircraft for trip; and blanket, thermometer, tissue box and cooling pack for sickness.

`timeline presentation`

- Moved Sunday and manual special-date labels from the body of the daily card to its footer.
- Kept future days distinct from zero-activity days.
- Expanded the introductory copy to use the full available content width.

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
- Added mutually exclusive tick-box controls for Sunday, winter holiday, summer holiday, trip and sickness states so special illustrations can be tested directly.
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

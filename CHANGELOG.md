# CHANGELOG

## v0.1.0-alpha.1 "Bold Cipher" (in development)

### Summary

- Established the first named alpha release of Weekly Penguin Timeline.
- Reworked the penguin visual system to better match the intended illustrated pixel-art character while retaining the Academic Website colour palette.
- Added live state inspection and started formal release documentation.

### Code changes

`penguin visual system`

- Replaced the initial minimal geometric penguin with a richer SVG illustration using the Academic Website Oxford blue, dark blue, coral, aqua, sky blue, off-white and neutral colours.
- Added stronger character details including large glasses, eyes and highlights, blush, beak, body shading, wings and feet.
- Added state-specific work props: resting state, notes and pencil, open book, laptop, books plus laptop, and an overloaded high-work state.
- Made coffee intensity visible through progressively accumulated cups and higher-intensity visual accents.
- Preserved dedicated special illustrations for Sunday prayer, winter holiday, summer holiday, trip, sickness and upcoming days.

`timeline presentation`

- Moved Sunday and manual special-date labels from the body of the daily card to its footer.
- Kept future days distinct from zero-activity days.
- Expanded the introductory copy to use the full available content width.

`Academic API`

- Removed all built-in demo work and coffee data.
- Weekly timeline data now come only from `get_public_work_analytics(year)`.
- Added an explicit live-data-unavailable state rather than silently substituting fixture values.
- Marked the demonstration page as dynamically rendered so production builds do not require runtime Academic API credentials.

`interactive state testing`

- Added a Penguin state tester between the weekly timeline and architecture cards.
- Added working-hours and coffee sliders that reuse the production state resolver.
- Displayed the resolved work bucket, coffee bucket and deterministic combined state identifier.

`release documentation`

- Set the application version to `0.1.0-alpha.1`.
- Added `lib/releases.ts` as the readable release-note source.
- Added a release-notes section to the demonstration page.
- Added this technical CHANGELOG.

### Release status

- Bold Cipher alpha.1 is in development.
- Release date: TBC.

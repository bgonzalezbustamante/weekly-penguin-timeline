export type ReleaseNoteSection = {
  title: string
  items: string[]
}

export type ReleaseNote = {
  version: string
  codename: string
  status: string
  releasedOn: string
  summary: string
  sections: ReleaseNoteSection[]
}

export const releases: ReleaseNote[] = [
  {
    version: 'v0.1.0-beta.2',
    codename: 'Summer Cedar',
    status: 'In development',
    releasedOn: 'Release date TBC',
    summary:
      'Summer Cedar refines mobile navigation, activity-intensity thresholds and alignment with the public data contracts.'
    sections: [
      {
        title: 'Mobile navigation',
        items: [
          'Mobile day controls are separated from the date rail so they have more room and clearer touch targets.',
          'Nearby dates now sit in a horizontally scrollable rail that keeps the selected date centred when possible.',
          'Week controls remain easy to reach, while First and Last are visually quieter shortcuts.',
        ],
      },
      {
        title: 'Activity states',
        items: [
          'Work and coffee thresholds now use clearer Light through Extreme levels, with eight hours remaining within the normal working-time range.',
          'The same 36 approved penguin illustrations remain in use; only the thresholds that select them have changed.',
        ],
      },
      {
        title: 'API alignment',
        items: [
          'Public availability now follows the API’s unique-range contract, with stricter checks for repeated ranges and conference metadata.',
          'Legitimate multiple presentations at the same conference still coalesce into one visual conference/travel state.',
        ],
      },
    ],
  },
  {
    version: 'v0.1.0-beta.1',
    codename: 'Frozen Ridge',
    status: 'Pre-release',
    releasedOn: '3 October 2026',
    summary:
      'Frozen Ridge makes the timeline more useful for real academic schedules, with clearer Saturdays, conference and travel states, Catholic Calendar integration and a longer browsing window.',
    sections: [
      {
        title: 'Calendar and travel',
        items: [
          'Conference days now have their own penguin, while Trip is reserved for the travel day before and after when travel is involved.',
          'Overlapping conferences combine their labels, and a conference day takes priority over an overlapping travel day.',
          'Selected Catholic celebrations now come from the Catholic Calendar package, including movable and transferred dates, while Christmas Eve remains a local rule.',
        ],
      },
      {
        title: 'Saturdays and navigation',
        items: [
          'Past zero-activity Saturdays stay Free Saturdays instead of inheriting the current Teaching season.',
          'Teaching Saturdays apply only to the current or future Saturday when Teaching season is active.',
          'The browser now covers roughly three months in each direction, with daily stepping, week jumps and quick Current day, First and Last controls.',
        ],
      },
      {
        title: 'Visuals and reliability',
        items: [
          'The state gallery now includes Conference and displays eight contextual states in two rows of four.',
          'Live public data for availability, conferences and Teaching settings are validated before the timeline is shown.',
          'The beta closes with the full automated checks and deploy preview passing.',
        ],
      },
    ],
  },
  {
    version: 'v0.1.0-alpha.1',
    codename: 'Bold Cipher',
    status: 'Pre-release',
    releasedOn: '2 October 2026',
    summary:
      'Bold Cipher established the reusable Weekly Penguin Timeline prototype with live work and coffee data, the approved penguin visual system and interactive state testing.',
    sections: [
      {
        title: 'Penguin system',
        items: [
          'Introduced the approved canonical mascot, 36 work-and-coffee states and distinct Sunday, holiday, trip and unavailable scenes.',
          'Added automatic lightweight WebP versions while preserving the PNG artwork as the source files.',
        ],
      },
      {
        title: 'Timeline',
        items: [
          'Connected the timeline to live Academic API work and coffee data and kept future days visually distinct from genuine zero-activity days.',
          'Added the first weekly browser, special-date rules and British-style date formatting.',
        ],
      },
      {
        title: 'Development tools',
        items: [
          'Added the interactive state tester, complete visual-QA matrix and automated regression checks.',
          'Introduced technical changelogs and reader-facing release notes.',
        ],
      },
    ],
  },
]

export const currentRelease = releases[0]

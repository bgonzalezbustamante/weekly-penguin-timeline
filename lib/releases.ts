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
    version: 'v0.1.0-alpha.1',
    codename: 'Bold Cipher',
    status: 'In development',
    releasedOn: 'Release date TBC',
    summary:
      'Bold Cipher establishes the first reusable Weekly Penguin Timeline prototype, with live Academic API data, a kawaii Oxford-colour penguin system, special-day rules, and an interactive state tester.',
    sections: [
      {
        title: 'Penguin states',
        items: [
          'Kept the approved canonical PNG as the immutable mascot ground truth and froze the validated alpha.1 visual set: 36 activity states and five special states.',
          'Added automated integrity checks for every PNG master and deterministic state-to-asset resolution.',
          'Generate lightweight WebP runtime derivatives while preserving the validated PNG masters unchanged.',
        ],
      },
      {
        title: 'Timeline behaviour',
        items: [
          'Kept Sunday and other overrides as special states, added labelled Sunday-style manual overrides, and added a switchable fixed Catholic set for Assumption, All Saints, All Souls, Immaculate Conception, Christmas Eve and Christmas Day.',
          'Made Sunday, winter holiday, summer holiday, trip and sickness visually distinct with dedicated scene props and expressions.',
          'Kept future days visually distinct from genuine zero-activity days, added a nine-week browser spanning four weeks either side of the current week, and retained British short-date formatting such as 28 Sept 2026.',
        ],
      },
      {
        title: 'Data and testing',
        items: [
          'Kept the timeline on live Academic API data only, validated the yearly payload before rendering, avoided unsupported future-year requests, linked the status label to the public API page, and retained green connected and muted-red unavailable indicators.',
          'Added regression tests for state boundaries, strict API payload validation, special-date rules and precedence, nine-week pagination, New Year API availability, DST-sensitive week boundaries and deterministic asset resolution.',
          'Kept the interactive tester and complete 36-state visual QA matrix while simplifying the tester readout.',
        ],
      },
      {
        title: 'Project structure',
        items: [
          'Separated API access, state resolution, asset preparation, sprite rendering, timeline presentation and manual date overrides for later reuse.',
          'Added CI asset validation, technical changelog and readable in-app release notes as the project enters its alpha release line.',
        ],
      },
    ],
  },
]

export const currentRelease = releases[0]

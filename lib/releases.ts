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
    version: 'v0.1.0-beta.1',
    codename: 'Frozen Ridge',
    status: 'In development',
    releasedOn: 'Release date TBC',
    summary:
      'Frozen Ridge opens the first beta line, beginning with a dedicated canonical couple state for Saturdays while preserving special-date precedence.',
    sections: [
      {
        title: 'Penguin states',
        items: [
          'Added canonical-couple.png as a validated Saturday PNG master with generated WebP runtime output.',
          'Added deterministic Saturday asset resolution without changing the canonical baseline used by the zero-work zero-coffee activity state.',
        ],
      },
      {
        title: 'Timeline behaviour',
        items: [
          'Saturdays now use the canonical couple illustration whether they are past or future.',
          'Special-date overrides continue to take priority, and future Saturdays retain the existing provisional dimming.',
        ],
      },
      {
        title: 'Release line',
        items: [
          'Started v0.1.0-beta.1 Frozen Ridge as the active development release after the tagged Bold Cipher alpha.1.',
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
      'Bold Cipher establishes the first reusable Weekly Penguin Timeline prototype, with live Academic API data, a kawaii Oxford-colour penguin system, special-day rules, and an interactive state tester.',
    sections: [
      {
        title: 'Penguin states',
        items: [
          'Kept the approved canonical PNG as the immutable mascot ground truth and froze the validated alpha.1 visual set: 36 activity states, five special states and one upcoming working-day state.',
          'Added automated integrity checks for every PNG master and deterministic state-to-asset resolution.',
          'Generate lightweight WebP runtime derivatives while preserving the validated PNG masters unchanged.',
        ],
      },
      {
        title: 'Timeline behaviour',
        items: [
          'Kept Sunday and other overrides as special states, added labelled Sunday-style manual overrides, and added a switchable fixed Catholic set for Assumption, All Saints, All Souls, Immaculate Conception, Christmas Eve and Christmas Day.',
          'Added a small note below the Sunday state-matrix card clarifying that the same icon is also used for major, widely observed Catholic celebrations.',
          'Made Sunday, winter holiday, summer holiday, trip and sickness visually distinct with dedicated scene props and expressions.',
          'Kept future days visually distinct from genuine zero-activity days: Monday–Friday use the working-day scene, Saturday uses the canonical baseline and Sunday keeps the Sunday scene, with every future illustration dimmed and special dates retaining priority.',
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

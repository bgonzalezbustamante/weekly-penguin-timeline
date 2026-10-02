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
          'Kept the approved canonical PNG as the immutable mascot ground truth and moved runtime rendering to complete derived state images.',
          'Resolved all 36 work × coffee combinations and five special states to approved PNG assets through a dedicated asset resolver.',
          'Kept the visual palette aligned with the Academic Website and use Next.js image optimisation for runtime delivery without replacing the PNG masters.',
        ],
      },
      {
        title: 'Timeline behaviour',
        items: [
          'Kept Sunday and other overrides as special states, moved their labels to the card footer and simplified the legend to Special state.',
          'Made Sunday, winter holiday, summer holiday, trip and sickness visually distinct with dedicated scene props and expressions.',
          'Kept future days visually distinct from genuine zero-activity days and switched displayed dates to British short-date formatting such as 28 Sept 2026.',
        ],
      },
      {
        title: 'Data and testing',
        items: [
          'Kept the timeline on live Academic API data only, with green connected and muted-red unavailable status points.',
          'Added an interactive tester for exploring work/coffee combinations and special states, plus a complete 36-state visual QA matrix and special-state gallery.',
        ],
      },
      {
        title: 'Project structure',
        items: [
          'Separated API access, state resolution, sprite rendering, timeline presentation and manual date overrides for later reuse.',
          'Added technical changelog and readable in-app release notes as the project enters its alpha release line.',
        ],
      },
    ],
  },
]

export const currentRelease = releases[0]

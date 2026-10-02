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
          'Refined the penguin towards the supplied kawaii reference with a rounder chibi body, oversized glasses, larger glossy eyes and softer academic props.',
          'Kept the visual palette aligned with the Academic Website while reducing the deliberately pixel-like treatment.',
          'Retained 30 normal combinations from six working-time bands and five coffee bands, with larger recognisable coffee mugs at higher coffee states.',
        ],
      },
      {
        title: 'Timeline behaviour',
        items: [
          'Kept Sunday as a praying-penguin state and moved Sunday and manual-override labels to the bottom of each daily card.',
          'Made Sunday, winter holiday, summer holiday, trip and sickness visually distinct with dedicated scene props and expressions.',
          'Kept future days visually distinct from genuine zero-activity days.',
        ],
      },
      {
        title: 'Data and testing',
        items: [
          'Kept the timeline on live Academic API data only, with green connected and muted-red unavailable status points.',
          'Added an interactive tester for exploring work/coffee combinations and special states, and corrected the Special state control heading layout.',
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

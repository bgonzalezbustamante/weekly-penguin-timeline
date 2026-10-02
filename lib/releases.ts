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
      'Bold Cipher establishes the first reusable Weekly Penguin Timeline prototype, with live Academic API data, a richer Oxford-colour penguin system, special-day rules, and an interactive state tester.',
    sections: [
      {
        title: 'Penguin states',
        items: [
          'Redesigned the penguin again towards a softer kawaii illustration with rounded forms, larger expressive eyes and gentler academic props.',
          'Kept the visual palette aligned with the Academic Website while reducing the deliberately pixel-like treatment.',
          'Retained 30 normal combinations from six working-time bands and five coffee bands.',
        ],
      },
      {
        title: 'Timeline behaviour',
        items: [
          'Kept Sunday as a praying-penguin state and moved Sunday and manual-override labels to the bottom of each daily card.',
          'Supported winter holiday, summer holiday, trip and sickness overrides from a small date configuration file.',
          'Kept future days visually distinct from genuine zero-activity days.',
        ],
      },
      {
        title: 'Data and testing',
        items: [
          'Removed built-in demo activity data so the weekly timeline now uses only the Academic API, with a green live-connection indicator when available.',
          'Added an interactive tester for exploring work/coffee combinations and the Sunday, holiday, trip and sickness special states.',
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

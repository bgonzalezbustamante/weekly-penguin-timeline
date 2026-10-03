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
      'Frozen Ridge opens the first beta line with Teaching-aware Saturdays, free-Saturday couple states and privacy-safe Academic API availability.',
    sections: [
      {
        title: 'Penguin states',
        items: [
          'Added canonical-couple.png as a validated Saturday PNG master with generated WebP runtime output.',
          'Added deterministic Saturday asset resolution while keeping ordinary activity-state resolution unchanged outside the Saturday rule.',
          'Added the canonical couple image to the visual QA gallery as Free Saturdays.',
          'Added teaching.png as the Teaching Saturdays contextual state and included it in visual QA.',
          'Reordered the seven contextual QA states into one row: Sunday, Teaching Saturdays, Free Saturdays, Trip, Winter holiday, Summer holiday and Unavailable.',
        ],
      },
      {
        title: 'Timeline behaviour',
        items: [
          'Recorded work or coffee on a Saturday always uses the normal activity matrix first, even during Teaching season.',
          'With no recorded Saturday activity, teaching_season_active selects the Teaching illustration — including today and future Saturdays — while an inactive Teaching season falls back to the canonical couple.',
          'Manual/local, package-backed Catholic and public-availability states continue to take priority, and future Saturdays retain the existing provisional dimming.',
          'Replaced the transitional fixed Catholic-date table with @bgonzalezbustamante/catholic-calendar@0.1.0-alpha.1; observed dates and transfers now come from the package while Christmas Eve remains a local recurring rule.',
          'Expanded package-backed celebrations to Palm Sunday, Holy Thursday, Good Friday, Holy Saturday, Easter Sunday, Divine Mercy, Ascension, Pentecost, Corpus Christi, Assumption, All Saints, All Souls, Immaculate and Christmas, using concise Timeline-owned labels.',
          'Expanded navigation to roughly three months before and after the current date with separate highlighted-day and displayed-week state: first load shows the current Monday–Sunday week with today highlighted, Current day restores that state, daily controls retain one-day rolling navigation, and Previous week/Next week switch to canonical weeks while preserving and centring the highlighted weekday.',
        ],
      },
      {
        title: 'Academic API availability',
        items: [
          'Added strict consumption of list_public_availability(year) for Winter/Summer holidays, trips and generic unavailable periods.',
          'Added strict consumption of get_public_teaching_settings(), exposing only the Teaching-season boolean used by the Saturday state resolver.',
          'Source precedence is manual/local override, package-backed Catholic celebration, then public availability; overlapping ranges remain supported, and repeated identical anonymous projections are coalesced only for rendering rather than treated as invalid source duplication.',
          'Unavailable periods remain labelled Unavailable and never consume private sickness reasons or Planning notes; the existing unavailable/sick artwork is reused for the visual state.',
        ],
      },
      {
        title: 'Release line',
        items: [
          'Frozen Ridge remains the active beta.1 development line after the tagged Bold Cipher alpha.1.',
          'Integrated the Catholic Calendar package while retaining a simplified special-dates.ts for manual/local overrides, recurring Christmas Eve and public-availability composition.',
          'Release notes now expose every recorded version, newest first, with one release per pagination page.',
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

import { describe, expect, it } from 'vitest'

import {
  availabilityToSpecialDates,
  conferencePresentationsToSpecialDates,
  getConfiguredSpecialDates,
  recurringSpecialDates,
  specialDates,
} from '@/content/special-dates'
import {
  catholicCalendarToSpecialDates,
  TIMELINE_CATHOLIC_OBSERVANCES,
} from '@/lib/catholic-calendar'
import { assertValidSpecialDateRules } from '@/lib/special-date-rules'
import { buildWeeklyTimeline } from '@/lib/timeline'
import type { PublicConferencePresentation } from '@/types/timeline'

function conference(
  overrides: Partial<PublicConferencePresentation> = {}
): PublicConferencePresentation {
  return {
    event_name: 'UDP Keynote',
    event_short_name: 'UDP Keynote',
    location: 'Santiago',
    presentation_date: '2026-08-07',
    start_date: '2026-08-07',
    end_date: '2026-08-07',
    personal_attendance: true,
    involves_trip: true,
    presentation_title: 'A keynote',
    authors: ['B. González-Bustamante'],
    presentation_type: 'Keynote',
    url: null,
    ...overrides,
  }
}

describe('Catholic Calendar integration', () => {
  it('keeps the timeline Catholic scope explicit with repo-specific labels', () => {
    expect(TIMELINE_CATHOLIC_OBSERVANCES).toEqual([
      { id: 'palm-sunday', label: 'Palm Sunday' },
      { id: 'holy-thursday', label: 'Holy Thursday' },
      { id: 'good-friday', label: 'Good Friday' },
      { id: 'holy-saturday', label: 'Holy Saturday' },
      { id: 'easter-sunday', label: 'Easter Sunday' },
      { id: 'divine-mercy-sunday', label: 'Divine Mercy' },
      { id: 'ascension', label: 'Ascension' },
      { id: 'pentecost', label: 'Pentecost' },
      { id: 'corpus-christi', label: 'Corpus Christi' },
      { id: 'assumption', label: 'Assumption' },
      { id: 'all-saints', label: 'All Saints' },
      { id: 'all-souls', label: 'All Souls' },
      { id: 'immaculate-conception', label: 'Immaculate' },
      { id: 'christmas', label: 'Christmas' },
    ])

    expect(recurringSpecialDates).toEqual([
      {
        monthDay: '12-24',
        type: 'sunday',
        label: 'Christmas Eve',
      },
    ])

    expect(specialDates).toEqual([])
  })

  it('resolves selected celebrations from the package with timeline labels', () => {
    expect(catholicCalendarToSpecialDates([2027])).toEqual([
      {
        date: '2027-03-21',
        type: 'sunday',
        label: 'Palm Sunday',
      },
      {
        date: '2027-03-25',
        type: 'sunday',
        label: 'Holy Thursday',
      },
      {
        date: '2027-03-26',
        type: 'sunday',
        label: 'Good Friday',
      },
      {
        date: '2027-03-27',
        type: 'sunday',
        label: 'Holy Saturday',
      },
      {
        date: '2027-03-28',
        type: 'sunday',
        label: 'Easter Sunday',
      },
      {
        date: '2027-04-04',
        type: 'sunday',
        label: 'Divine Mercy',
      },
      {
        date: '2027-05-06',
        type: 'sunday',
        label: 'Ascension',
      },
      {
        date: '2027-05-16',
        type: 'sunday',
        label: 'Pentecost',
      },
      {
        date: '2027-05-27',
        type: 'sunday',
        label: 'Corpus Christi',
      },
      {
        date: '2027-08-15',
        type: 'sunday',
        label: 'Assumption',
      },
      {
        date: '2027-11-01',
        type: 'sunday',
        label: 'All Saints',
      },
      {
        date: '2027-11-02',
        type: 'sunday',
        label: 'All Souls',
      },
      {
        date: '2027-12-08',
        type: 'sunday',
        label: 'Immaculate',
      },
      {
        date: '2027-12-25',
        type: 'sunday',
        label: 'Christmas',
      },
    ])
  })

  it('uses the package observed date when a selected solemnity transfers', () => {
    const dates = catholicCalendarToSpecialDates([2024])
    const immaculate = dates.find(
      (entry) =>
        'date' in entry &&
        entry.label === 'Immaculate'
    )

    expect(immaculate).toEqual({
      date: '2024-12-09',
      type: 'sunday',
      label: 'Immaculate',
    })
    expect(
      dates.some(
        (entry) =>
          'date' in entry &&
          entry.date === '2024-12-08' &&
          entry.label === 'Immaculate'
      )
    ).toBe(false)
  })

  it('keeps Christmas Eve as the local recurring presentation override', () => {
    const configured = getConfiguredSpecialDates([2027])

    expect(configured[0]).toEqual({
      date: '2027-12-24',
      type: 'sunday',
      label: 'Christmas Eve',
    })
    expect(
      configured.some(
        (entry) =>
          'date' in entry &&
          entry.date === '2027-12-25' &&
          entry.label === 'Christmas'
      )
    ).toBe(true)
  })

  it('does not add 1 January merely because the package models it', () => {
    const configured = getConfiguredSpecialDates([2027])

    expect(
      configured.some(
        (entry) => 'date' in entry && entry.date.endsWith('-01-01')
      )
    ).toBe(false)
  })

  it('deduplicates repeated requested years', () => {
    expect(getConfiguredSpecialDates([2027, 2027])).toHaveLength(15)
  })

  it('rejects years outside the package contract', () => {
    expect(() => catholicCalendarToSpecialDates([1999])).toThrow(
      'Catholic Calendar supports years 2000–2100.'
    )
  })

  it('uses conference dates from the conference API and trip only for travel days', () => {
    expect(
      conferencePresentationsToSpecialDates([conference()])
    ).toEqual([
      {
        from: '2026-08-06',
        to: '2026-08-06',
        type: 'trip',
        label: 'UDP Keynote',
      },
      {
        from: '2026-08-07',
        to: '2026-08-07',
        type: 'conference',
        label: 'UDP Keynote',
      },
      {
        from: '2026-08-08',
        to: '2026-08-08',
        type: 'trip',
        label: 'UDP Keynote',
      },
    ])
  })

  it('supports multi-day conferences with one travel day on each side', () => {
    expect(
      conferencePresentationsToSpecialDates([
        conference({
          end_date: '2026-08-09',
        }),
      ])
    ).toEqual([
      {
        from: '2026-08-06',
        to: '2026-08-06',
        type: 'trip',
        label: 'UDP Keynote',
      },
      {
        from: '2026-08-07',
        to: '2026-08-09',
        type: 'conference',
        label: 'UDP Keynote',
      },
      {
        from: '2026-08-10',
        to: '2026-08-10',
        type: 'trip',
        label: 'UDP Keynote',
      },
    ])
  })

  it('does not add travel days when involves_trip is false', () => {
    expect(
      conferencePresentationsToSpecialDates([
        conference({
          involves_trip: false,
        }),
      ])
    ).toEqual([
      {
        from: '2026-08-07',
        to: '2026-08-07',
        type: 'conference',
        label: 'UDP Keynote',
      },
    ])
  })

  it('ignores conferences not personally attended', () => {
    expect(
      conferencePresentationsToSpecialDates([
        conference({
          personal_attendance: false,
          involves_trip: false,
        }),
      ])
    ).toEqual([])
  })

  it('coalesces repeated presentation records visually without treating them as invalid', () => {
    expect(
      conferencePresentationsToSpecialDates([
        conference(),
        conference({
          presentation_title: 'A second presentation',
        }),
      ])
    ).toEqual([
      {
        from: '2026-08-06',
        to: '2026-08-06',
        type: 'trip',
        label: 'UDP Keynote',
      },
      {
        from: '2026-08-07',
        to: '2026-08-07',
        type: 'conference',
        label: 'UDP Keynote',
      },
      {
        from: '2026-08-08',
        to: '2026-08-08',
        type: 'trip',
        label: 'UDP Keynote',
      },
    ])
  })

  it('combines labels for overlapping conferences and lets conference beat trip', () => {
    expect(
      conferencePresentationsToSpecialDates([
        conference({
          event_name: 'Conference A',
          event_short_name: 'Conference A',
          presentation_date: '2026-08-07',
          start_date: '2026-08-07',
          end_date: '2026-08-08',
        }),
        conference({
          event_name: 'Conference B',
          event_short_name: 'Conference B',
          presentation_date: '2026-08-08',
          start_date: '2026-08-08',
          end_date: '2026-08-09',
        }),
      ])
    ).toEqual([
      {
        from: '2026-08-06',
        to: '2026-08-06',
        type: 'trip',
        label: 'Conference A',
      },
      {
        from: '2026-08-07',
        to: '2026-08-07',
        type: 'conference',
        label: 'Conference A',
      },
      {
        from: '2026-08-08',
        to: '2026-08-08',
        type: 'conference',
        label: 'Conference A · Conference B',
      },
      {
        from: '2026-08-09',
        to: '2026-08-09',
        type: 'conference',
        label: 'Conference B',
      },
      {
        from: '2026-08-10',
        to: '2026-08-10',
        type: 'trip',
        label: 'Conference B',
      },
    ])
  })

  it('uses availability only for non-conference availability states', () => {
    expect(
      availabilityToSpecialDates([
        {
          type: 'winter_holiday',
          start_date: '2027-01-02',
          end_date: '2027-01-05',
          label: 'Winter holiday',
        },
        {
          type: 'summer_holiday',
          start_date: '2027-07-10',
          end_date: '2027-07-20',
          label: 'Summer holiday',
        },
        {
          type: 'trip',
          start_date: '2027-08-10',
          end_date: '2027-08-14',
          label: 'Ignored trip projection',
        },
        {
          type: 'unavailable',
          start_date: '2027-10-01',
          end_date: '2027-10-02',
          label: 'Unavailable',
        },
      ])
    ).toEqual([
      {
        from: '2027-10-01',
        to: '2027-10-02',
        type: 'unavailable',
        label: 'Unavailable',
      },
      {
        from: '2027-01-02',
        to: '2027-01-05',
        type: 'winter-holiday',
        label: 'Winter holiday',
      },
      {
        from: '2027-07-10',
        to: '2027-07-20',
        type: 'summer-holiday',
        label: 'Summer holiday',
      },
    ])
  })

  it('keeps local and package Catholic dates ahead of conferences', () => {
    const configured = getConfiguredSpecialDates(
      [2027],
      [],
      [
        conference({
          event_name: 'Christmas Conference',
          event_short_name: 'Christmas Conference',
          presentation_date: '2027-12-24',
          start_date: '2027-12-24',
          end_date: '2027-12-25',
          involves_trip: false,
        }),
      ]
    )

    const christmas = buildWeeklyTimeline({
      now: new Date('2027-12-25T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: configured,
    })

    expect(
      christmas.find((day) => day.date === '2027-12-24')
    ).toMatchObject({
      mode: 'sunday',
      specialLabel: 'Christmas Eve',
    })
    expect(
      christmas.find((day) => day.date === '2027-12-25')
    ).toMatchObject({
      mode: 'sunday',
      specialLabel: 'Christmas',
    })
  })

  it('feeds package celebrations into the normal Sunday-style timeline state', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2027-12-25T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: getConfiguredSpecialDates([2027]),
    })

    expect(
      timeline.find((day) => day.date === '2027-12-25')
    ).toMatchObject({
      mode: 'sunday',
      specialLabel: 'Christmas',
    })
  })
})

describe('special-date validation', () => {
  it('rejects impossible manual calendar dates', () => {
    expect(() =>
      assertValidSpecialDateRules([
        {
          date: '2027-02-29',
          type: 'sunday',
          label: 'Invalid leap day',
        },
      ])
    ).toThrow('valid YYYY-MM-DD calendar date')
  })

  it('rejects reversed manual date ranges', () => {
    expect(() =>
      assertValidSpecialDateRules([
        {
          from: '2027-08-20',
          to: '2027-08-15',
          type: 'summer-holiday',
        },
      ])
    ).toThrow('start on or before it ends')
  })

  it('rejects overlapping manual rules when ambiguity is not allowed', () => {
    expect(() =>
      assertValidSpecialDateRules(
        [
          {
            from: '2027-08-10',
            to: '2027-08-20',
            type: 'summer-holiday',
          },
          {
            date: '2027-08-15',
            type: 'sunday',
            label: 'Assumption',
          },
        ],
        { allowOverlaps: false }
      )
    ).toThrow('rules 1 and 2 overlap')
  })

  it('allows ordered overlap for explicit precedence layers', () => {
    expect(() =>
      assertValidSpecialDateRules([
        {
          date: '2027-12-24',
          type: 'trip',
          label: 'Travel',
        },
        {
          date: '2027-12-24',
          type: 'sunday',
          label: 'Christmas Eve',
        },
      ])
    ).not.toThrow()
  })

  it('rejects empty custom labels', () => {
    expect(() =>
      assertValidSpecialDateRules([
        {
          date: '2027-03-26',
          type: 'sunday',
          label: '   ',
        },
      ])
    ).toThrow('label must be a non-empty string')
  })
})

import { describe, expect, it } from 'vitest'

import {
  availabilityToSpecialDates,
  getConfiguredSpecialDates,
  recurringSpecialDates,
  specialDates,
} from '@/content/special-dates'
import {
  catholicCalendarToSpecialDates,
  TIMELINE_CATHOLIC_OBSERVANCE_IDS,
} from '@/lib/catholic-calendar'
import { assertValidSpecialDateRules } from '@/lib/special-date-rules'
import { buildWeeklyTimeline } from '@/lib/timeline'

describe('Catholic Calendar integration', () => {
  it('keeps the timeline Catholic scope explicit and compact', () => {
    expect(TIMELINE_CATHOLIC_OBSERVANCE_IDS).toEqual([
      'assumption',
      'all-saints',
      'all-souls',
      'immaculate-conception',
      'christmas',
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

  it('resolves selected celebrations from the package', () => {
    expect(catholicCalendarToSpecialDates([2027])).toEqual([
      {
        date: '2027-08-15',
        type: 'sunday',
        label: 'Assumption of the Blessed Virgin Mary',
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
        label: 'Immaculate Conception',
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
        entry.label === 'Immaculate Conception'
    )

    expect(immaculate).toEqual({
      date: '2024-12-09',
      type: 'sunday',
      label: 'Immaculate Conception',
    })
    expect(
      dates.some(
        (entry) =>
          'date' in entry &&
          entry.date === '2024-12-08' &&
          entry.label === 'Immaculate Conception'
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
    expect(getConfiguredSpecialDates([2027, 2027])).toHaveLength(6)
  })

  it('rejects years outside the package contract', () => {
    expect(() => catholicCalendarToSpecialDates([1999])).toThrow(
      'Catholic Calendar supports years 2000–2100.'
    )
  })

  it('maps public availability onto privacy-safe timeline states', () => {
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
          label: 'Trip',
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
        from: '2027-08-10',
        to: '2027-08-14',
        type: 'trip',
        label: 'Trip',
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

  it('keeps local and package Catholic dates ahead of public availability', () => {
    const availability = [
      {
        type: 'trip' as const,
        start_date: '2027-12-24',
        end_date: '2027-12-25',
        label: 'Trip',
      },
    ]
    const configured = getConfiguredSpecialDates([2027], availability)

    expect(configured[0]).toEqual({
      date: '2027-12-24',
      type: 'sunday',
      label: 'Christmas Eve',
    })
    expect(configured.at(-1)).toEqual({
      from: '2027-12-24',
      to: '2027-12-25',
      type: 'trip',
      label: 'Trip',
    })

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

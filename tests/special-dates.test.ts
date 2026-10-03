import { describe, expect, it } from 'vitest'

import {
  availabilityToSpecialDates,
  CATHOLIC_FIXED_DATES,
  getConfiguredSpecialDates,
  specialDates,
} from '@/content/special-dates'
import { assertValidSpecialDateRules } from '@/lib/special-date-rules'
import { buildWeeklyTimeline } from '@/lib/timeline'

describe('fixed Catholic celebrations', () => {
  it('defines the compact fixed-date set without 1 January', () => {
    expect(CATHOLIC_FIXED_DATES).toEqual([
      { monthDay: '08-15', label: 'Assumption' },
      { monthDay: '11-01', label: 'All Saints' },
      { monthDay: '11-02', label: 'All Souls' },
      { monthDay: '12-08', label: 'Immaculate' },
      { monthDay: '12-24', label: 'Christmas Eve' },
      { monthDay: '12-25', label: 'Christmas Day' },
    ])
  })

  it('expands enabled fixed celebrations for the requested year', () => {
    const configured = getConfiguredSpecialDates([2027], true)
    const builtIns = configured.slice(specialDates.length)

    expect(builtIns).toEqual([
      { date: '2027-08-15', type: 'sunday', label: 'Assumption' },
      { date: '2027-11-01', type: 'sunday', label: 'All Saints' },
      { date: '2027-11-02', type: 'sunday', label: 'All Souls' },
      {
        date: '2027-12-08',
        type: 'sunday',
        label: 'Immaculate',
      },
      { date: '2027-12-24', type: 'sunday', label: 'Christmas Eve' },
      { date: '2027-12-25', type: 'sunday', label: 'Christmas Day' },
    ])

    expect(
      builtIns.some(
        (entry) => 'date' in entry && entry.date.endsWith('-01-01')
      )
    ).toBe(false)
  })

  it('returns only manual overrides when fixed celebrations are disabled', () => {
    expect(getConfiguredSpecialDates([2027], false)).toEqual(specialDates)
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

  it('places public availability after manual overrides and before Catholic dates', () => {
    const availability = [
      {
        type: 'trip' as const,
        start_date: '2026-12-24',
        end_date: '2026-12-25',
        label: 'Trip',
      },
    ]
    const configured = getConfiguredSpecialDates([2026], true, availability)

    expect(configured[0]).toEqual(specialDates[0])
    expect(configured[1]).toEqual({
      from: '2026-12-24',
      to: '2026-12-25',
      type: 'trip',
      label: 'Trip',
    })

    const christmas = buildWeeklyTimeline({
      now: new Date('2026-12-25T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: configured,
    })

    expect(christmas.find((day) => day.date === '2026-12-24')).toMatchObject({
      mode: 'sunday',
      specialLabel: 'Christmas Eve',
    })
    expect(christmas.find((day) => day.date === '2026-12-25')).toMatchObject({
      mode: 'trip',
      specialLabel: 'Trip',
    })
  })

  it('keeps manual overrides before built-in dates for resolver precedence', () => {
    const configured = getConfiguredSpecialDates([2026], true)

    expect(configured.slice(0, specialDates.length)).toEqual(specialDates)
    expect(configured[specialDates.length]).toEqual({
      date: '2026-08-15',
      type: 'sunday',
      label: 'Assumption',
    })
  })

  it('feeds fixed celebrations into the normal Sunday-style timeline state', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2027-12-25T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: getConfiguredSpecialDates([2027], true),
    })

    expect(timeline.find((day) => day.date === '2027-12-25')).toMatchObject({
      mode: 'sunday',
      specialLabel: 'Christmas Day',
    })
  })

  it('deduplicates repeated requested years', () => {
    const configured = getConfiguredSpecialDates([2027, 2027], true)
    const builtIns = configured.slice(specialDates.length)

    expect(builtIns).toHaveLength(6)
  })

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

  it('allows ordered overlap when applying manual-over-built-in precedence', () => {
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

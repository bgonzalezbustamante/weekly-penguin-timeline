import { describe, expect, it } from 'vitest'

import {
  CATHOLIC_FIXED_DATES,
  getConfiguredSpecialDates,
  specialDates,
} from '@/content/special-dates'
import { buildWeeklyTimeline } from '@/lib/timeline'

describe('fixed Catholic celebrations', () => {
  it('defines the compact fixed-date set without 1 January', () => {
    expect(CATHOLIC_FIXED_DATES).toEqual([
      { monthDay: '08-15', label: 'Assumption' },
      { monthDay: '11-01', label: 'All Saints' },
      { monthDay: '11-02', label: 'All Souls' },
      { monthDay: '12-08', label: 'Immaculate Conception' },
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
        label: 'Immaculate Conception',
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
})

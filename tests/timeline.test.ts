import { describe, expect, it } from 'vitest'

import {
  buildWeeklyTimeline,
  formatDisplayDate,
  formatMinutes,
  resolveCoffeeBucket,
  resolveWorkBucket,
  yearsForCurrentWeek,
} from '@/lib/timeline'

describe('work bucket boundaries', () => {
  it.each([
    [-1, 'zero'],
    [0, 'zero'],
    [1, 'under-4'],
    [239, 'under-4'],
    [240, '4-6'],
    [359, '4-6'],
    [360, '6-8'],
    [479, '6-8'],
    [480, '8-10'],
    [599, '8-10'],
    [600, '10-plus'],
    [900, '10-plus'],
  ] as const)('maps %i minutes to %s', (minutes, expected) => {
    expect(resolveWorkBucket(minutes)).toBe(expected)
  })
})

describe('coffee bucket boundaries', () => {
  it.each([
    [-1, 'zero'],
    [0, 'zero'],
    [1, 'under-4'],
    [3, 'under-4'],
    [4, '4-6'],
    [5, '4-6'],
    [6, '6-8'],
    [7, '6-8'],
    [8, '8-10'],
    [9, '8-10'],
    [10, '10-plus'],
    [14, '10-plus'],
  ] as const)('maps %i coffees to %s', (coffees, expected) => {
    expect(resolveCoffeeBucket(coffees)).toBe(expected)
  })
})

describe('weekly timeline resolution', () => {
  it('uses a labelled sunday asset for a manually configured Christian holiday', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2027-03-26T12:00:00Z'),
      timeZone: 'UTC',
      days: [
        {
          date: '2027-03-26',
          net_minutes: 420,
          coffee_count: 2,
        },
      ],
      specialDates: [
        {
          date: '2027-03-26',
          type: 'sunday',
          label: 'Good Friday',
        },
      ],
    })

    const holiday = timeline.find((day) => day.date === '2027-03-26')

    expect(holiday).toMatchObject({
      mode: 'sunday',
      specialLabel: 'Good Friday',
      workBucket: '6-8',
      coffeeBucket: 'under-4',
    })
  })

  it('labels an automatic weekly Sunday as Sunday', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-04T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
    })

    const sunday = timeline.find((day) => day.date === '2026-10-04')

    expect(sunday).toMatchObject({
      mode: 'sunday',
      specialLabel: 'Sunday',
    })
  })

  it('gives explicit overrides priority over the weekly Sunday rule', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-04T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: [
        {
          date: '2026-10-04',
          type: 'trip',
          label: 'Conference trip',
        },
      ],
    })

    const sunday = timeline.find((day) => day.date === '2026-10-04')

    expect(sunday).toMatchObject({
      mode: 'trip',
      specialLabel: 'Conference trip',
    })
  })

  it('distinguishes missing past data from future days', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-09-30T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
    })

    expect(timeline.find((day) => day.date === '2026-09-28')).toMatchObject({
      mode: 'activity',
      workBucket: 'zero',
      coffeeBucket: 'zero',
      isFuture: false,
    })

    expect(timeline.find((day) => day.date === '2026-10-01')).toMatchObject({
      mode: 'upcoming',
      isFuture: true,
    })
  })
})

describe('week and display helpers', () => {
  it('loads both years when a Monday-to-Sunday week crosses New Year', () => {
    expect(
      yearsForCurrentWeek(new Date('2026-12-31T12:00:00Z'), 'UTC')
    ).toEqual([2026, 2027])
  })

  it('formats dates with the preferred Sept abbreviation', () => {
    expect(formatDisplayDate('2026-09-28')).toBe('28 Sept 2026')
  })

  it.each([
    [0, '0m'],
    [45, '45m'],
    [60, '1h'],
    [135, '2h 15m'],
  ] as const)('formats %i minutes as %s', (minutes, expected) => {
    expect(formatMinutes(minutes)).toBe(expected)
  })
})

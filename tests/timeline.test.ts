import { describe, expect, it } from 'vitest'

import {
  buildTimelineWeeks,
  buildWeeklyTimeline,
  formatDisplayDate,
  formatMinutes,
  resolveCoffeeBucket,
  resolveWorkBucket,
  weekWindowForMonthRange,
  yearsForCurrentWeek,
  yearsForTimelineWindow,
  yearsForWorkAnalytics,
  yearsForWorkAnalyticsWindow,
} from '@/lib/timeline'

describe('work bucket boundaries', () => {
  it.each([
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

  it('rejects invalid working-minute values', () => {
    expect(() => resolveWorkBucket(-1)).toThrow('non-negative')
    expect(() => resolveWorkBucket(Number.NaN)).toThrow('finite')
  })
})

describe('coffee bucket boundaries', () => {
  it.each([
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

  it('rejects invalid coffee counts', () => {
    expect(() => resolveCoffeeBucket(-1)).toThrow('non-negative')
    expect(() => resolveCoffeeBucket(1.5)).toThrow('integer')
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

  it('uses the generic unavailable label without exposing a sickness label', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-02T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: [
        {
          date: '2026-10-02',
          type: 'unavailable',
          label: 'Unavailable',
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-10-02')).toMatchObject({
      mode: 'unavailable',
      specialLabel: 'Unavailable',
    })
  })

  it('renders a combined label for overlapping trip ranges', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-08-08T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: [
        {
          from: '2026-08-06',
          to: '2026-08-07',
          type: 'trip',
          label: 'UDP Keynote',
        },
        {
          date: '2026-08-08',
          type: 'trip',
          label: 'UDP Keynote · ECPR',
        },
        {
          from: '2026-08-09',
          to: '2026-08-12',
          type: 'trip',
          label: 'ECPR',
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-08-07')).toMatchObject({
      mode: 'trip',
      specialLabel: 'UDP Keynote',
    })
    expect(timeline.find((day) => day.date === '2026-08-08')).toMatchObject({
      mode: 'trip',
      specialLabel: 'UDP Keynote · ECPR',
    })
    expect(timeline.find((day) => day.date === '2026-08-09')).toMatchObject({
      mode: 'trip',
      specialLabel: 'ECPR',
    })
  })

  it('renders conference dates with the conference state and label', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-08-07T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      specialDates: [
        {
          date: '2026-08-07',
          type: 'conference',
          label: 'UDP Keynote',
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-08-07')).toMatchObject({
      mode: 'conference',
      specialLabel: 'UDP Keynote',
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

  it('distinguishes sparse past input from future days', () => {
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
      mode: 'working-day',
      isFuture: true,
    })
  })

  it('uses distinct future weekday, Saturday and Sunday states', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-01T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
    })

    expect(timeline.find((day) => day.date === '2026-10-02')).toMatchObject({
      mode: 'working-day',
      isFuture: true,
      specialLabel: null,
    })
    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'saturday',
      isFuture: true,
      specialLabel: null,
    })
    expect(timeline.find((day) => day.date === '2026-10-04')).toMatchObject({
      mode: 'sunday',
      isFuture: true,
      specialLabel: 'Sunday',
    })
  })

  it('uses normal activity states for non-free past Saturdays', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-04T12:00:00Z'),
      timeZone: 'UTC',
      days: [
        {
          date: '2026-10-03',
          net_minutes: 480,
          coffee_count: 4,
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'activity',
      isFuture: false,
      workBucket: '8-10',
      coffeeBucket: '4-6',
      specialLabel: null,
    })
  })

  it('uses the canonical couple mode for zero-work zero-coffee Saturdays', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-04T12:00:00Z'),
      timeZone: 'UTC',
      days: [
        {
          date: '2026-10-03',
          net_minutes: 0,
          coffee_count: 0,
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'saturday',
      isFuture: false,
      workBucket: 'zero',
      coffeeBucket: 'zero',
      specialLabel: null,
    })
  })

  it('keeps recorded Saturday activity ahead of the Teaching-season state', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-04T12:00:00Z'),
      timeZone: 'UTC',
      teachingSeasonActive: true,
      days: [
        {
          date: '2026-10-03',
          net_minutes: 480,
          coffee_count: 4,
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'activity',
      isFuture: false,
      workBucket: '8-10',
      coffeeBucket: '4-6',
      specialLabel: null,
    })
  })

  it('uses the teaching state for upcoming Saturdays while teaching season is active', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-01T12:00:00Z'),
      timeZone: 'UTC',
      teachingSeasonActive: true,
      days: [],
    })

    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'teaching',
      isFuture: true,
      specialLabel: null,
    })
  })

  it('uses the Teaching state for zero-work zero-coffee Saturdays during Teaching season', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-04T12:00:00Z'),
      timeZone: 'UTC',
      teachingSeasonActive: true,
      days: [
        {
          date: '2026-10-03',
          net_minutes: 0,
          coffee_count: 0,
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'teaching',
      isFuture: false,
      workBucket: 'zero',
      coffeeBucket: 'zero',
      specialLabel: null,
    })
  })

  it('uses the Teaching state on the current Saturday when there is no activity', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-03T12:00:00Z'),
      timeZone: 'UTC',
      teachingSeasonActive: true,
      days: [],
    })

    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'teaching',
      isToday: true,
      isFuture: false,
      workBucket: 'zero',
      coffeeBucket: 'zero',
      specialLabel: null,
    })
  })

  it('keeps future special dates ahead of weekday and weekend defaults', () => {
    const timeline = buildWeeklyTimeline({
      now: new Date('2026-10-01T12:00:00Z'),
      timeZone: 'UTC',
      teachingSeasonActive: true,
      days: [],
      specialDates: [
        {
          date: '2026-10-02',
          type: 'trip',
          label: 'Conference trip',
        },
        {
          date: '2026-10-03',
          type: 'sick',
        },
      ],
    })

    expect(timeline.find((day) => day.date === '2026-10-02')).toMatchObject({
      mode: 'trip',
      isFuture: true,
      specialLabel: 'Conference trip',
    })
    expect(timeline.find((day) => day.date === '2026-10-03')).toMatchObject({
      mode: 'sick',
      isFuture: true,
      specialLabel: 'Sick',
    })
  })

  it('rejects duplicate direct-input work dates instead of using last-row wins', () => {
    expect(() =>
      buildWeeklyTimeline({
        now: new Date('2026-09-30T12:00:00Z'),
        timeZone: 'UTC',
        days: [
          {
            date: '2026-09-30',
            net_minutes: 60,
            coffee_count: 1,
          },
          {
            date: '2026-09-30',
            net_minutes: 120,
            coffee_count: 2,
          },
        ],
      })
    ).toThrow('duplicate date 2026-09-30')
  })

  it('uses the configured timezone across the spring DST transition', () => {
    const sundayNight = buildWeeklyTimeline({
      now: new Date('2027-03-28T21:30:00Z'),
      timeZone: 'Europe/Amsterdam',
      days: [],
    })
    const mondayMorning = buildWeeklyTimeline({
      now: new Date('2027-03-28T22:30:00Z'),
      timeZone: 'Europe/Amsterdam',
      days: [],
    })

    expect(sundayNight[0].date).toBe('2027-03-22')
    expect(mondayMorning[0].date).toBe('2027-03-29')
    expect(mondayMorning[0].isToday).toBe(true)
  })
})


describe('weekly timeline pagination window', () => {
  it('derives a weekly browser spanning three months before and after', () => {
    const window = weekWindowForMonthRange(
      new Date('2026-10-02T12:00:00Z'),
      'UTC',
      3,
      3
    )

    expect(window).toEqual({
      pastWeeks: 13,
      futureWeeks: 13,
    })

    const weeks = buildTimelineWeeks({
      now: new Date('2026-10-02T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      ...window,
    })

    expect(weeks).toHaveLength(27)
    expect(weeks[0]).toMatchObject({
      offset: -13,
      startDate: '2026-06-29',
      endDate: '2026-07-05',
      isCurrentWeek: false,
    })
    expect(weeks[13]).toMatchObject({
      offset: 0,
      startDate: '2026-09-28',
      endDate: '2026-10-04',
      isCurrentWeek: true,
    })
    expect(weeks[26]).toMatchObject({
      offset: 13,
      startDate: '2026-12-28',
      endDate: '2027-01-03',
      isCurrentWeek: false,
    })
  })

  it('keeps today semantics anchored to the real current week', () => {
    const weeks = buildTimelineWeeks({
      now: new Date('2026-10-02T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
    })

    expect(weeks[4].days.find((day) => day.isToday)?.date).toBe('2026-10-02')
    expect(weeks[5].days.every((day) => !day.isToday && day.isFuture)).toBe(true)
  })

  it('supports direct weekly offsets without changing today', () => {
    const previousWeek = buildWeeklyTimeline({
      now: new Date('2026-10-02T12:00:00Z'),
      timeZone: 'UTC',
      days: [],
      weekOffset: -1,
    })

    expect(previousWeek[0].date).toBe('2026-09-21')
    expect(previousWeek[6].date).toBe('2026-09-27')
    expect(previousWeek.some((day) => day.isToday)).toBe(false)
  })

  it('rejects invalid month-window sizes', () => {
    expect(() =>
      weekWindowForMonthRange(
        new Date('2026-10-02T12:00:00Z'),
        'UTC',
        -1,
        3
      )
    ).toThrow('non-negative integers')
  })

  it('rejects invalid pagination window sizes and fractional offsets', () => {
    expect(() =>
      buildTimelineWeeks({
        now: new Date('2026-10-02T12:00:00Z'),
        timeZone: 'UTC',
        days: [],
        pastWeeks: -1,
      })
    ).toThrow('non-negative integers')

    expect(() =>
      buildWeeklyTimeline({
        now: new Date('2026-10-02T12:00:00Z'),
        timeZone: 'UTC',
        days: [],
        weekOffset: 1.5,
      })
    ).toThrow('Week offset must be an integer')
  })

  it('collects all calendar years needed by the three-month browser', () => {
    expect(
      yearsForTimelineWindow(
        new Date('2026-12-31T12:00:00Z'),
        'UTC',
        13,
        13
      )
    ).toEqual([2026, 2027])
  })

  it('loads only API-supported years while the browser reaches into a future year', () => {
    expect(
      yearsForWorkAnalyticsWindow(
        new Date('2026-12-31T12:00:00Z'),
        'UTC',
        13,
        13
      )
    ).toEqual([2026])

    expect(
      yearsForWorkAnalyticsWindow(
        new Date('2027-01-01T12:00:00Z'),
        'UTC',
        13,
        13
      )
    ).toEqual([2026, 2027])
  })
})

describe('week and display helpers', () => {
  it('identifies both calendar years when a Monday-to-Sunday week crosses New Year', () => {
    expect(
      yearsForCurrentWeek(new Date('2026-12-31T12:00:00Z'), 'UTC')
    ).toEqual([2026, 2027])
  })

  it('does not request a future year that the Academic API rejects', () => {
    expect(
      yearsForWorkAnalytics(new Date('2026-12-31T12:00:00Z'), 'UTC')
    ).toEqual([2026])
  })

  it('requests both years once the new year is available to the API', () => {
    expect(
      yearsForWorkAnalytics(new Date('2027-01-01T12:00:00Z'), 'UTC')
    ).toEqual([2026, 2027])
  })

  it('respects the API UTC year boundary when local time has crossed midnight', () => {
    const now = new Date('2026-12-31T23:30:00Z')

    expect(yearsForCurrentWeek(now, 'Europe/Amsterdam')).toEqual([2026, 2027])
    expect(yearsForWorkAnalytics(now, 'Europe/Amsterdam')).toEqual([2026])
  })

  it('does not request years below the Academic API lower bound', () => {
    expect(
      yearsForCurrentWeek(new Date('2000-01-01T12:00:00Z'), 'UTC')
    ).toEqual([1999, 2000])
    expect(
      yearsForWorkAnalytics(new Date('2000-01-01T12:00:00Z'), 'UTC')
    ).toEqual([2000])
  })

  it('formats dates with the preferred Sept abbreviation', () => {
    expect(formatDisplayDate('2026-09-28')).toBe('28 Sept 2026')
  })

  it('rejects impossible display dates instead of rolling them over', () => {
    expect(() => formatDisplayDate('2026-02-30')).toThrow(
      'valid YYYY-MM-DD calendar date'
    )
  })

  it.each([
    [0, '0m'],
    [45, '45m'],
    [60, '1h'],
    [135, '2h 15m'],
  ] as const)('formats %i minutes as %s', (minutes, expected) => {
    expect(formatMinutes(minutes)).toBe(expected)
  })

  it('rejects invalid working-time formatting input', () => {
    expect(() => formatMinutes(-1)).toThrow('non-negative')
    expect(() => formatMinutes(1.5)).toThrow('integer')
  })
})

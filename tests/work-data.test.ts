import { describe, expect, it } from 'vitest'

import {
  assertValidPublicWorkDays,
  parsePublicWorkAnalytics,
} from '@/lib/work-data'

function calendarDays(year: number) {
  const days = []
  const current = new Date(Date.UTC(year, 0, 1, 12))

  while (current.getUTCFullYear() === year) {
    days.push({
      date: current.toISOString().slice(0, 10),
      net_minutes: 0,
      coffee_count: 0,
    })
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return days
}

function validPayload(year = 2026) {
  return {
    year,
    average_net_minutes_per_working_day: 360,
    average_coffees_per_working_day: 2.5,
    days: calendarDays(year),
  }
}

describe('public work analytics validation', () => {
  it('accepts a complete valid calendar-year payload', () => {
    const payload = validPayload(2026)

    expect(parsePublicWorkAnalytics(payload, 2026)).toEqual(payload)
  })

  it('accepts a complete leap-year payload', () => {
    const payload = validPayload(2028)

    expect(parsePublicWorkAnalytics(payload, 2028).days).toHaveLength(366)
  })

  it('rejects an unexpected payload year', () => {
    expect(() => parsePublicWorkAnalytics(validPayload(2026), 2025)).toThrow(
      'returned year 2026 instead of 2025'
    )
  })

  it('rejects malformed calendar dates', () => {
    const payload = validPayload(2026)
    payload.days[59].date = '2026-02-30'

    expect(() => parsePublicWorkAnalytics(payload, 2026)).toThrow(
      'valid YYYY-MM-DD calendar date'
    )
  })

  it('rejects duplicate daily rows', () => {
    const days = calendarDays(2026)
    days.push({ ...days[0] })

    expect(() => assertValidPublicWorkDays(days)).toThrow(
      'duplicate date 2026-01-01'
    )
  })

  it('rejects incomplete calendar-year API data', () => {
    const payload = validPayload(2026)
    payload.days.pop()

    expect(() => parsePublicWorkAnalytics(payload, 2026)).toThrow(
      'must contain 365 unique calendar days'
    )
  })

  it('rejects negative or non-integer daily metrics', () => {
    const negativeMinutes = validPayload(2026)
    negativeMinutes.days[0].net_minutes = -1

    expect(() => parsePublicWorkAnalytics(negativeMinutes, 2026)).toThrow(
      'net_minutes'
    )

    const fractionalCoffee = validPayload(2026)
    fractionalCoffee.days[0].coffee_count = 1.5

    expect(() => parsePublicWorkAnalytics(fractionalCoffee, 2026)).toThrow(
      'coffee_count'
    )
  })

  it('rejects invalid aggregate values instead of coercing them', () => {
    const payload = {
      ...validPayload(2026),
      average_coffees_per_working_day: Number.NaN,
    }

    expect(() => parsePublicWorkAnalytics(payload, 2026)).toThrow(
      'average_coffees_per_working_day'
    )
  })
})

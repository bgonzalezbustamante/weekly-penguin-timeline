import type { SpecialDate } from '@/types/timeline'

export const ENABLE_CATHOLIC_FIXED_DATES = true

export const CATHOLIC_FIXED_DATES = [
  { monthDay: '08-15', label: 'Assumption' },
  { monthDay: '11-01', label: 'All Saints' },
  { monthDay: '11-02', label: 'All Souls' },
  { monthDay: '12-08', label: 'Immaculate' },
  { monthDay: '12-24', label: 'Christmas Eve' },
  { monthDay: '12-25', label: 'Christmas Day' },
] as const

/**
 * Manual presentation overrides.
 * sunday
 * winter-holiday
 * summer-holiday
 * trip
 * sick
 *
 * Manual entries take precedence over enabled built-in Catholic dates.
 */
export const specialDates: SpecialDate[] = [
  {
    from: '2026-12-24',
    to: '2026-12-24',
    type: 'sunday',
    label: 'Christmas Eve',
  },
]

export function getConfiguredSpecialDates(
  years: number[],
  enableCatholicFixedDates = ENABLE_CATHOLIC_FIXED_DATES
): SpecialDate[] {
  if (!enableCatholicFixedDates) {
    return [...specialDates]
  }

  const catholicDates: SpecialDate[] = Array.from(new Set(years)).flatMap(
    (year) =>
      CATHOLIC_FIXED_DATES.map(({ monthDay, label }) => ({
        date: `${year}-${monthDay}`,
        type: 'sunday' as const,
        label,
      }))
  )

  return [...specialDates, ...catholicDates]
}

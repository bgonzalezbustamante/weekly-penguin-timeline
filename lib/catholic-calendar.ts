import {
  buildYearObservances,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@bgonzalezbustamante/catholic-calendar'

import { assertValidSpecialDateRules } from '@/lib/special-date-rules'
import type { SpecialDate } from '@/types/timeline'

export const TIMELINE_CATHOLIC_OBSERVANCE_IDS = [
  'assumption',
  'all-saints',
  'all-souls',
  'immaculate-conception',
  'christmas',
] as const

const timelineObservanceIds = new Set<string>(
  TIMELINE_CATHOLIC_OBSERVANCE_IDS
)

export function catholicCalendarToSpecialDates(
  years: number[]
): SpecialDate[] {
  const uniqueYears = Array.from(new Set(years)).sort(
    (left, right) => left - right
  )

  for (const year of uniqueYears) {
    if (
      !Number.isInteger(year) ||
      year < MIN_SUPPORTED_YEAR ||
      year > MAX_SUPPORTED_YEAR
    ) {
      throw new RangeError(
        `Catholic Calendar supports years ${MIN_SUPPORTED_YEAR}–${MAX_SUPPORTED_YEAR}.`
      )
    }
  }

  const catholicDates: SpecialDate[] = uniqueYears.flatMap((year) =>
    buildYearObservances(year)
      .filter(
        (observance) =>
          timelineObservanceIds.has(observance.id) &&
          observance.observedDate !== null
      )
      .map((observance) => ({
        date: observance.observedDate!,
        type: 'sunday' as const,
        label: observance.name,
      }))
  )

  assertValidSpecialDateRules(catholicDates, {
    allowOverlaps: false,
  })

  return catholicDates
}

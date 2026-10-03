import { assertValidSpecialDateRules } from '@/lib/special-date-rules'
import type {
  PublicAvailabilityItem,
  PublicAvailabilityType,
  SpecialDate,
  SpecialDayType,
} from '@/types/timeline'

export const ENABLE_CATHOLIC_FIXED_DATES = true

/**
 * Transitional local source.
 * Once bgonzalezbustamante/catholic-calendar is ready for consumption,
 * replace this fixed-date layer with that package/API and reassess whether
 * manual overrides and this module are still needed.
 */
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
 * unavailable
 * Manual entries take precedence over enabled built-in Catholic dates,
 * which in turn take precedence over public availability.
 */
export const specialDates: SpecialDate[] = [
  {
    from: '2026-12-24',
    to: '2026-12-24',
    type: 'sunday',
    label: 'Christmas Eve',
  },
]

const AVAILABILITY_TYPE_MAP: Record<
  PublicAvailabilityType,
  SpecialDayType
> = {
  winter_holiday: 'winter-holiday',
  summer_holiday: 'summer-holiday',
  trip: 'trip',
  unavailable: 'unavailable',
}

const AVAILABILITY_PRIORITY: Record<PublicAvailabilityType, number> = {
  unavailable: 0,
  trip: 1,
  winter_holiday: 2,
  summer_holiday: 2,
}

export function availabilityToSpecialDates(
  availability: PublicAvailabilityItem[]
): SpecialDate[] {
  return [...availability]
    .sort((left, right) => {
      const priority =
        AVAILABILITY_PRIORITY[left.type] - AVAILABILITY_PRIORITY[right.type]

      if (priority !== 0) return priority

      return (
        left.start_date.localeCompare(right.start_date) ||
        left.end_date.localeCompare(right.end_date) ||
        left.type.localeCompare(right.type)
      )
    })
    .map((item) => ({
      from: item.start_date,
      to: item.end_date,
      type: AVAILABILITY_TYPE_MAP[item.type],
      label: item.label,
    }))
}

export function getConfiguredSpecialDates(
  years: number[],
  enableCatholicFixedDates = ENABLE_CATHOLIC_FIXED_DATES,
  publicAvailability: PublicAvailabilityItem[] = []
): SpecialDate[] {
  assertValidSpecialDateRules(specialDates, { allowOverlaps: false })

  const availabilityDates =
    availabilityToSpecialDates(publicAvailability)

  if (!enableCatholicFixedDates) {
    return [...specialDates, ...availabilityDates]
  }

  const catholicDates: SpecialDate[] = Array.from(new Set(years)).flatMap(
    (year) =>
      CATHOLIC_FIXED_DATES.map(({ monthDay, label }) => ({
        date: `${year}-${monthDay}`,
        type: 'sunday' as const,
        label,
      }))
  )

  assertValidSpecialDateRules(catholicDates, { allowOverlaps: false })

  return [...specialDates, ...catholicDates, ...availabilityDates]
}

import { catholicCalendarToSpecialDates } from '@/lib/catholic-calendar'
import { assertValidSpecialDateRules } from '@/lib/special-date-rules'
import type {
  PublicAvailabilityItem,
  PublicAvailabilityType,
  SpecialDate,
  SpecialDayType,
} from '@/types/timeline'

/**
 * Local/manual presentation overrides only.
 *
 * Catholic observance dates are resolved by
 * @bgonzalezbustamante/catholic-calendar. Keep this module for timeline-only
 * exceptions that are not part of the package's selected observance model.
 */
export const recurringSpecialDates = [
  {
    monthDay: '12-24',
    type: 'sunday',
    label: 'Christmas Eve',
  },
] as const

export const specialDates: SpecialDate[] = []

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
  publicAvailability: PublicAvailabilityItem[] = []
): SpecialDate[] {
  assertValidSpecialDateRules(specialDates, { allowOverlaps: false })

  const uniqueYears = Array.from(new Set(years))
  const localRecurringDates: SpecialDate[] = uniqueYears.flatMap((year) =>
    recurringSpecialDates.map(({ monthDay, type, label }) => ({
      date: `${year}-${monthDay}`,
      type,
      label,
    }))
  )
  const catholicDates = catholicCalendarToSpecialDates(uniqueYears)
  const availabilityDates =
    availabilityToSpecialDates(publicAvailability)

  assertValidSpecialDateRules(localRecurringDates, {
    allowOverlaps: false,
  })

  return [
    ...specialDates,
    ...localRecurringDates,
    ...catholicDates,
    ...availabilityDates,
  ]
}

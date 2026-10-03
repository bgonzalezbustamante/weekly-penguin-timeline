import { catholicCalendarToSpecialDates } from '@/lib/catholic-calendar'
import { parseIsoDateUtc } from '@/lib/date-utils'
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

function addIsoDay(value: string) {
  const date = parseIsoDateUtc(value)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

function datesInRange(startDate: string, endDate: string) {
  const dates: string[] = []

  for (
    let date = startDate;
    date <= endDate;
    date = addIsoDay(date)
  ) {
    dates.push(date)
  }

  return dates
}

function combinedTripSpecialDates(
  trips: PublicAvailabilityItem[]
): SpecialDate[] {
  const labelsByDate = new Map<string, string[]>()

  for (const trip of trips) {
    for (const date of datesInRange(trip.start_date, trip.end_date)) {
      const labels = labelsByDate.get(date) ?? []

      if (!labels.includes(trip.label)) {
        labels.push(trip.label)
      }

      labelsByDate.set(date, labels)
    }
  }

  const segments: Array<{
    from: string
    to: string
    type: 'trip'
    label: string
  }> = []

  for (const [date, labels] of [...labelsByDate.entries()].sort(
    ([left], [right]) => left.localeCompare(right)
  )) {
    const label = labels.join(' · ')
    const previous = segments.at(-1)

    if (
      previous &&
      previous.label === label &&
      addIsoDay(previous.to) === date
    ) {
      previous.to = date
      continue
    }

    segments.push({
      from: date,
      to: date,
      type: 'trip',
      label,
    })
  }

  return segments
}

export function availabilityToSpecialDates(
  availability: PublicAvailabilityItem[]
): SpecialDate[] {
  const seenProjectedStates = new Set<string>()
  const distinctAvailability = [...availability]
    .sort((left, right) => {
      const priority =
        AVAILABILITY_PRIORITY[left.type] - AVAILABILITY_PRIORITY[right.type]

      if (priority !== 0) return priority

      return (
        left.start_date.localeCompare(right.start_date) ||
        left.end_date.localeCompare(right.end_date) ||
        left.type.localeCompare(right.type) ||
        left.label.localeCompare(right.label)
      )
    })
    .filter((item) => {
      const key = [
        item.type,
        item.start_date,
        item.end_date,
        item.label,
      ].join('|')

      if (seenProjectedStates.has(key)) return false

      seenProjectedStates.add(key)
      return true
    })

  const unavailableDates: SpecialDate[] = []
  const trips: PublicAvailabilityItem[] = []
  const holidayDates: SpecialDate[] = []

  for (const item of distinctAvailability) {
    if (item.type === 'trip') {
      trips.push(item)
      continue
    }

    const specialDate: SpecialDate = {
      from: item.start_date,
      to: item.end_date,
      type: AVAILABILITY_TYPE_MAP[item.type],
      label: item.label,
    }

    if (item.type === 'unavailable') {
      unavailableDates.push(specialDate)
    } else {
      holidayDates.push(specialDate)
    }
  }

  return [
    ...unavailableDates,
    ...combinedTripSpecialDates(trips),
    ...holidayDates,
  ]
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

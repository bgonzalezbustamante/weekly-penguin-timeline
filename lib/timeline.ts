import {
  isoDateInTimeZone,
  parseIsoDateUtc,
} from '@/lib/date-utils'
import { assertValidSpecialDateRules } from '@/lib/special-date-rules'
import { assertValidPublicWorkDays } from '@/lib/work-data'
import type {
  CoffeeBucket,
  PenguinMode,
  PublicWorkDay,
  SpecialDate,
  SpecialDayType,
  TimelineDay,
  TimelineWeek,
  WorkBucket,
} from '@/types/timeline'

const WORK_LABELS: Record<WorkBucket, string> = {
  zero: '0h',
  'under-4': '<4h',
  '4-6': '4–6h',
  '6-8': '6–8h',
  '8-10': '8–10h',
  '10-plus': '10h+',
}

const COFFEE_LABELS: Record<CoffeeBucket, string> = {
  zero: '0',
  'under-4': '<4',
  '4-6': '4–6',
  '6-8': '6–8',
  '8-10': '8–10',
  '10-plus': '10+',
}

const SPECIAL_LABELS: Record<SpecialDayType, string> = {
  sunday: 'Sunday',
  'winter-holiday': 'Winter holiday',
  'summer-holiday': 'Summer holiday',
  trip: 'Trip',
  sick: 'Sick',
}

export function resolveWorkBucket(minutes: number): WorkBucket {
  if (!Number.isFinite(minutes) || minutes < 0) {
    throw new Error('Working minutes must be a non-negative finite number.')
  }

  if (minutes === 0) return 'zero'
  if (minutes < 240) return 'under-4'
  if (minutes < 360) return '4-6'
  if (minutes < 480) return '6-8'
  if (minutes < 600) return '8-10'
  return '10-plus'
}

export function resolveCoffeeBucket(count: number): CoffeeBucket {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error('Coffee count must be a non-negative integer.')
  }

  if (count === 0) return 'zero'
  if (count < 4) return 'under-4'
  if (count < 6) return '4-6'
  if (count < 8) return '6-8'
  if (count < 10) return '8-10'
  return '10-plus'
}

function addDays(value: string, days: number) {
  const date = parseIsoDateUtc(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function mondayFor(value: string) {
  const date = parseIsoDateUtc(value)
  const weekday = date.getUTCDay()
  const offset = weekday === 0 ? -6 : 1 - weekday
  return addDays(value, offset)
}

function findSpecialDate(date: string, overrides: SpecialDate[]) {
  return (
    overrides.find((entry) => {
      if ('date' in entry) return entry.date === date
      return date >= entry.from && date <= entry.to
    }) ?? null
  )
}

function getMode(
  date: string,
  isFuture: boolean,
  special: SpecialDate | null
): PenguinMode {
  if (special) return special.type

  const weekday = parseIsoDateUtc(date).getUTCDay()

  if (weekday === 6) return 'saturday'
  if (weekday === 0) return 'sunday'
  if (isFuture) return 'working-day'

  return 'activity'
}

export function buildWeeklyTimeline({
  now = new Date(),
  timeZone = 'Europe/Amsterdam',
  days,
  specialDates = [],
  weekOffset = 0,
}: {
  now?: Date
  timeZone?: string
  days: PublicWorkDay[]
  specialDates?: SpecialDate[]
  weekOffset?: number
}): TimelineDay[] {
  assertValidPublicWorkDays(days)
  assertValidSpecialDateRules(specialDates)

  if (!Number.isInteger(weekOffset)) {
    throw new Error('Week offset must be an integer.')
  }

  const today = isoDateInTimeZone(now, timeZone)
  const monday = addDays(mondayFor(today), weekOffset * 7)
  const byDate = new Map(days.map((day) => [day.date, day]))

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index)
    const source = byDate.get(date)
    const isFuture = date > today
    const special = findSpecialDate(date, specialDates)
    const netMinutes = source?.net_minutes ?? 0
    const coffeeCount = source?.coffee_count ?? 0
    const workBucket = resolveWorkBucket(netMinutes)
    const coffeeBucket = resolveCoffeeBucket(coffeeCount)
    const parsed = parseIsoDateUtc(date)
    const weekday = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      timeZone: 'UTC',
    }).format(parsed)

    const mode = getMode(date, isFuture, special)

    return {
      date,
      weekday,
      dayNumber: parsed.getUTCDate(),
      isToday: date === today,
      isFuture,
      netMinutes,
      coffeeCount,
      workBucket,
      coffeeBucket,
      workLabel: WORK_LABELS[workBucket],
      coffeeLabel: COFFEE_LABELS[coffeeBucket],
      mode,
      specialLabel:
        special?.label ??
        (special
          ? SPECIAL_LABELS[special.type]
          : mode === 'sunday'
            ? SPECIAL_LABELS.sunday
            : null),
    }
  })
}

function assertWeekWindow(pastWeeks: number, futureWeeks: number) {
  if (
    !Number.isInteger(pastWeeks) ||
    !Number.isInteger(futureWeeks) ||
    pastWeeks < 0 ||
    futureWeeks < 0
  ) {
    throw new Error('Week window sizes must be non-negative integers.')
  }
}

export function yearsForTimelineWindow(
  now = new Date(),
  timeZone = 'Europe/Amsterdam',
  pastWeeks = 4,
  futureWeeks = 4
) {
  assertWeekWindow(pastWeeks, futureWeeks)

  const today = isoDateInTimeZone(now, timeZone)
  const currentMonday = mondayFor(today)
  const years = new Set<number>()

  for (let offset = -pastWeeks; offset <= futureWeeks; offset += 1) {
    const monday = addDays(currentMonday, offset * 7)
    const sunday = addDays(monday, 6)
    years.add(Number(monday.slice(0, 4)))
    years.add(Number(sunday.slice(0, 4)))
  }

  return Array.from(years).sort((left, right) => left - right)
}

export function yearsForCurrentWeek(
  now = new Date(),
  timeZone = 'Europe/Amsterdam'
) {
  return yearsForTimelineWindow(now, timeZone, 0, 0)
}

export function yearsForWorkAnalyticsWindow(
  now = new Date(),
  timeZone = 'Europe/Amsterdam',
  pastWeeks = 4,
  futureWeeks = 4
) {
  const latestApiYear = now.getUTCFullYear()

  return yearsForTimelineWindow(
    now,
    timeZone,
    pastWeeks,
    futureWeeks
  ).filter((year) => year >= 2000 && year <= latestApiYear)
}

export function yearsForWorkAnalytics(
  now = new Date(),
  timeZone = 'Europe/Amsterdam'
) {
  return yearsForWorkAnalyticsWindow(now, timeZone, 0, 0)
}

export function buildTimelineWeeks({
  now = new Date(),
  timeZone = 'Europe/Amsterdam',
  days,
  specialDates = [],
  pastWeeks = 4,
  futureWeeks = 4,
}: {
  now?: Date
  timeZone?: string
  days: PublicWorkDay[]
  specialDates?: SpecialDate[]
  pastWeeks?: number
  futureWeeks?: number
}): TimelineWeek[] {
  assertWeekWindow(pastWeeks, futureWeeks)
  assertValidPublicWorkDays(days)
  assertValidSpecialDateRules(specialDates)

  return Array.from(
    { length: pastWeeks + futureWeeks + 1 },
    (_, index) => index - pastWeeks
  ).map((offset) => {
    const weekDays = buildWeeklyTimeline({
      now,
      timeZone,
      days,
      specialDates,
      weekOffset: offset,
    })

    return {
      offset,
      startDate: weekDays[0].date,
      endDate: weekDays[6].date,
      isCurrentWeek: offset === 0,
      days: weekDays,
    }
  })
}

export function formatDisplayDate(value: string) {
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseIsoDateUtc(value))

  return formatted.replace('Sep ', 'Sept ')
}

export function formatMinutes(minutes: number) {
  if (!Number.isInteger(minutes) || minutes < 0) {
    throw new Error('Working minutes must be a non-negative integer.')
  }

  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60

  if (hours === 0) return `${remainder}m`
  if (remainder === 0) return `${hours}h`
  return `${hours}h ${remainder}m`
}

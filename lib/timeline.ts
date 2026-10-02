import type {
  CoffeeBucket,
  PenguinMode,
  PublicWorkDay,
  SpecialDate,
  SpecialDayType,
  TimelineDay,
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
  'winter-holiday': 'Winter holiday',
  'summer-holiday': 'Summer holiday',
  trip: 'Trip',
  sick: 'Sick',
}

export function resolveWorkBucket(minutes: number): WorkBucket {
  if (minutes <= 0) return 'zero'
  if (minutes < 240) return 'under-4'
  if (minutes < 360) return '4-6'
  if (minutes < 480) return '6-8'
  if (minutes < 600) return '8-10'
  return '10-plus'
}

export function resolveCoffeeBucket(count: number): CoffeeBucket {
  if (count <= 0) return 'zero'
  if (count < 4) return 'under-4'
  if (count < 6) return '4-6'
  if (count < 8) return '6-8'
  if (count < 10) return '8-10'
  return '10-plus'
}

function toIsoDate(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12))
}

function addDays(value: string, days: number) {
  const date = parseIsoDate(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function mondayFor(value: string) {
  const date = parseIsoDate(value)
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

  const weekday = parseIsoDate(date).getUTCDay()
  if (weekday === 0) return 'sunday'
  if (isFuture) return 'upcoming'

  return 'activity'
}

export function buildWeeklyTimeline({
  now = new Date(),
  timeZone = 'Europe/Amsterdam',
  days,
  specialDates = [],
}: {
  now?: Date
  timeZone?: string
  days: PublicWorkDay[]
  specialDates?: SpecialDate[]
}): TimelineDay[] {
  const today = toIsoDate(now, timeZone)
  const monday = mondayFor(today)
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
    const parsed = parseIsoDate(date)
    const weekday = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      timeZone: 'UTC',
    }).format(parsed)

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
      mode: getMode(date, isFuture, special),
      specialLabel:
        special?.label ??
        (special ? SPECIAL_LABELS[special.type] : null),
    }
  })
}

export function yearsForCurrentWeek(
  now = new Date(),
  timeZone = 'Europe/Amsterdam'
) {
  const today = toIsoDate(now, timeZone)
  const monday = mondayFor(today)
  const sunday = addDays(monday, 6)
  return Array.from(
    new Set([Number(monday.slice(0, 4)), Number(sunday.slice(0, 4))])
  )
}

export function formatDisplayDate(value: string) {
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseIsoDate(value))

  return formatted.replace('Sep ', 'Sept ')
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60

  if (hours === 0) return `${remainder}m`
  if (remainder === 0) return `${hours}h`
  return `${hours}h ${remainder}m`
}

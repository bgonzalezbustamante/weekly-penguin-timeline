export type WorkBucket =
  | 'zero'
  | 'under-4'
  | '4-6'
  | '6-8'
  | '8-10'
  | '10-plus'

export type CoffeeBucket =
  | 'zero'
  | '2-4'
  | '4-6'
  | '8-10'
  | '10-plus'

export type SpecialDayType =
  | 'winter-holiday'
  | 'summer-holiday'
  | 'trip'
  | 'sick'

export type SpecialDate =
  | {
      date: string
      type: SpecialDayType
      label?: string
    }
  | {
      from: string
      to: string
      type: SpecialDayType
      label?: string
    }

export type PublicWorkDay = {
  date: string
  net_minutes: number
  coffee_count: number
}

export type PublicWorkAnalytics = {
  year: number
  average_net_minutes_per_working_day: number
  average_coffees_per_working_day: number
  days: PublicWorkDay[]
}

export type PenguinMode =
  | 'activity'
  | 'sunday'
  | 'winter-holiday'
  | 'summer-holiday'
  | 'trip'
  | 'sick'
  | 'upcoming'

export type TimelineDay = {
  date: string
  weekday: string
  dayNumber: number
  isToday: boolean
  isFuture: boolean
  netMinutes: number
  coffeeCount: number
  workBucket: WorkBucket
  coffeeBucket: CoffeeBucket
  workLabel: string
  coffeeLabel: string
  mode: PenguinMode
  specialLabel: string | null
}

import type {
  CoffeeBucket,
  PenguinMode,
  WorkBucket,
} from '@/types/timeline'

export const WORK_BUCKETS: WorkBucket[] = [
  'zero',
  'light',
  'normal',
  'heavy',
  'very-heavy',
  'extreme',
]

export const COFFEE_BUCKETS: CoffeeBucket[] = [
  'zero',
  'light',
  'normal',
  'heavy',
  'very-heavy',
  'extreme',
]

const WORK_ASSET_BUCKETS: Record<WorkBucket, string> = {
  zero: 'zero',
  light: 'under-4',
  normal: '4-6',
  heavy: '6-8',
  'very-heavy': '8-10',
  extreme: '10-plus',
}

const COFFEE_ASSET_BUCKETS: Record<CoffeeBucket, string> = {
  zero: 'zero',
  light: 'under-4',
  normal: '4-6',
  heavy: '6-8',
  'very-heavy': '8-10',
  extreme: '10-plus',
}

const SPECIAL_ASSETS: Partial<Record<PenguinMode, string>> = {
  sunday: '/penguins/states/webp/sunday.webp',
  'winter-holiday': '/penguins/states/webp/winter-holiday.webp',
  'summer-holiday': '/penguins/states/webp/summer-holiday.webp',
  trip: '/penguins/states/webp/trip.webp',
  conference: '/penguins/states/webp/conference.webp',
  sick: '/penguins/states/webp/sick.webp',
  unavailable: '/penguins/states/webp/sick.webp',
}

export function resolvePenguinAsset({
  mode,
  workBucket,
  coffeeBucket,
}: {
  mode: PenguinMode
  workBucket: WorkBucket
  coffeeBucket: CoffeeBucket
}) {
  if (mode === 'saturday') {
    return '/penguins/states/webp/canonical-couple.webp'
  }

  if (mode === 'teaching') {
    return '/penguins/states/webp/teaching.webp'
  }

  if (mode === 'working-day') {
    return '/penguins/states/webp/working-day.webp'
  }

  if (mode === 'upcoming') {
    return '/penguins/canonical-baseline.webp'
  }

  const specialAsset = SPECIAL_ASSETS[mode]
  if (specialAsset) {
    return specialAsset
  }

  if (workBucket === 'zero' && coffeeBucket === 'zero') {
    return '/penguins/canonical-baseline.webp'
  }

  return `/penguins/states/webp/work-${WORK_ASSET_BUCKETS[workBucket]}__coffee-${COFFEE_ASSET_BUCKETS[coffeeBucket]}.webp`
}

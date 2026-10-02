import type {
  CoffeeBucket,
  PenguinMode,
  WorkBucket,
} from '@/types/timeline'

export const WORK_BUCKETS: WorkBucket[] = [
  'zero',
  'under-4',
  '4-6',
  '6-8',
  '8-10',
  '10-plus',
]

export const COFFEE_BUCKETS: CoffeeBucket[] = [
  'zero',
  'under-4',
  '4-6',
  '6-8',
  '8-10',
  '10-plus',
]

const SPECIAL_ASSETS: Partial<Record<PenguinMode, string>> = {
  sunday: '/penguins/states/webp/sunday.webp',
  'winter-holiday': '/penguins/states/webp/winter-holiday.webp',
  'summer-holiday': '/penguins/states/webp/summer-holiday.webp',
  trip: '/penguins/states/webp/trip.webp',
  sick: '/penguins/states/webp/sick.webp',
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

  return `/penguins/states/work-${workBucket}__coffee-${coffeeBucket}.png`
}

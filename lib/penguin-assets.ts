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
  sunday: '/penguins/states/sunday.png',
  'winter-holiday': '/penguins/states/winter-holiday.png',
  'summer-holiday': '/penguins/states/summer-holiday.png',
  trip: '/penguins/states/trip.png',
  sick: '/penguins/states/sick.png',
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
    return '/penguins/canonical-baseline.png'
  }

  const specialAsset = SPECIAL_ASSETS[mode]
  if (specialAsset) {
    return specialAsset
  }

  if (workBucket === 'zero' && coffeeBucket === 'zero') {
    return '/penguins/canonical-baseline.png'
  }

  return `/penguins/states/work-${workBucket}__coffee-${coffeeBucket}.png`
}

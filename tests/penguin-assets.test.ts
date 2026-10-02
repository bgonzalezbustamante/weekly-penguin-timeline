import { describe, expect, it } from 'vitest'

import { resolvePenguinAsset } from '@/lib/penguin-assets'

describe('penguin asset resolution', () => {
  it('uses the canonical runtime asset for the zero-work zero-coffee state', () => {
    expect(
      resolvePenguinAsset({
        mode: 'activity',
        workBucket: 'zero',
        coffeeBucket: 'zero',
      })
    ).toBe('/penguins/canonical-baseline.webp')
  })

  it('resolves a normal work and coffee combination deterministically', () => {
    expect(
      resolvePenguinAsset({
        mode: 'activity',
        workBucket: '8-10',
        coffeeBucket: '6-8',
      })
    ).toBe('/penguins/states/webp/work-8-10__coffee-6-8.webp')
  })

  it('resolves manual and weekly Sunday states to the approved special asset', () => {
    expect(
      resolvePenguinAsset({
        mode: 'sunday',
        workBucket: '10-plus',
        coffeeBucket: '10-plus',
      })
    ).toBe('/penguins/states/webp/sunday.webp')
  })

  it('uses the approved working-day asset for future weekdays', () => {
    expect(
      resolvePenguinAsset({
        mode: 'working-day',
        workBucket: '10-plus',
        coffeeBucket: '10-plus',
      })
    ).toBe('/penguins/states/webp/working-day.webp')
  })

  it('uses the canonical asset for generic upcoming days such as Saturdays', () => {
    expect(
      resolvePenguinAsset({
        mode: 'upcoming',
        workBucket: '10-plus',
        coffeeBucket: '10-plus',
      })
    ).toBe('/penguins/canonical-baseline.webp')
  })
})

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
        workBucket: 'very-heavy',
        coffeeBucket: 'heavy',
      })
    ).toBe('/penguins/states/webp/work-8-10__coffee-6-8.webp')
  })

  it('resolves manual and weekly Sunday states to the approved special asset', () => {
    expect(
      resolvePenguinAsset({
        mode: 'sunday',
        workBucket: 'extreme',
        coffeeBucket: 'extreme',
      })
    ).toBe('/penguins/states/webp/sunday.webp')
  })

  it('uses the conference asset for attended conference days', () => {
    expect(
      resolvePenguinAsset({
        mode: 'conference',
        workBucket: 'zero',
        coffeeBucket: 'zero',
      })
    ).toBe('/penguins/states/webp/conference.webp')
  })

  it('uses the existing unavailable artwork for generic public unavailable periods', () => {
    expect(
      resolvePenguinAsset({
        mode: 'unavailable',
        workBucket: 'zero',
        coffeeBucket: 'zero',
      })
    ).toBe('/penguins/states/webp/sick.webp')
  })

  it('uses the approved working-day asset for future weekdays', () => {
    expect(
      resolvePenguinAsset({
        mode: 'working-day',
        workBucket: 'extreme',
        coffeeBucket: 'extreme',
      })
    ).toBe('/penguins/states/webp/working-day.webp')
  })

  it('uses the teaching asset for teaching-season Saturdays', () => {
    expect(
      resolvePenguinAsset({
        mode: 'teaching',
        workBucket: 'very-heavy',
        coffeeBucket: 'normal',
      })
    ).toBe('/penguins/states/webp/teaching.webp')
  })

  it('uses the canonical couple asset for Saturdays', () => {
    expect(
      resolvePenguinAsset({
        mode: 'saturday',
        workBucket: 'extreme',
        coffeeBucket: 'extreme',
      })
    ).toBe('/penguins/states/webp/canonical-couple.webp')
  })

  it('keeps the canonical baseline as the generic upcoming fallback', () => {
    expect(
      resolvePenguinAsset({
        mode: 'upcoming',
        workBucket: 'extreme',
        coffeeBucket: 'extreme',
      })
    ).toBe('/penguins/canonical-baseline.webp')
  })
})

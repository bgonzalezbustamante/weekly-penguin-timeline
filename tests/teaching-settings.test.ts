import { describe, expect, it } from 'vitest'

import { parsePublicTeachingSettings } from '@/lib/teaching-settings-data'

describe('public teaching settings validation', () => {
  it('accepts exactly one teaching-season boolean row', () => {
    expect(
      parsePublicTeachingSettings([
        {
          teaching_season_active: true,
        },
      ])
    ).toEqual({
      teaching_season_active: true,
    })

    expect(
      parsePublicTeachingSettings([
        {
          teaching_season_active: false,
        },
      ])
    ).toEqual({
      teaching_season_active: false,
    })
  })

  it('rejects missing, duplicate or malformed settings rows', () => {
    expect(() => parsePublicTeachingSettings([])).toThrow('exactly one')
    expect(() =>
      parsePublicTeachingSettings([
        { teaching_season_active: true },
        { teaching_season_active: false },
      ])
    ).toThrow('exactly one')

    expect(() =>
      parsePublicTeachingSettings([
        {
          teaching_season_active: 'true',
        },
      ])
    ).toThrow('must be a boolean')
  })

  it('rejects extra fields so the public contract stays narrow', () => {
    expect(() =>
      parsePublicTeachingSettings([
        {
          teaching_season_active: true,
          owner_id: 'private',
        },
      ])
    ).toThrow('unexpected object shape')
  })
})

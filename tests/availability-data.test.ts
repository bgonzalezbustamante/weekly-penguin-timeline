import { describe, expect, it } from 'vitest'

import { parsePublicAvailability } from '@/lib/availability-data'

describe('public availability validation', () => {
  it('accepts the controlled public availability vocabulary', () => {
    const payload = [
      {
        type: 'winter_holiday',
        start_date: '2026-12-21',
        end_date: '2026-12-31',
        label: 'Winter holiday',
      },
      {
        type: 'summer_holiday',
        start_date: '2026-07-13',
        end_date: '2026-07-24',
        label: 'Summer holiday',
      },
      {
        type: 'trip',
        start_date: '2026-08-10',
        end_date: '2026-08-14',
        label: 'Trip',
      },
      {
        type: 'unavailable',
        start_date: '2026-10-02',
        end_date: '2026-10-02',
        label: 'Unavailable',
      },
    ]

    expect(parsePublicAvailability(payload, 2026)).toEqual(payload)
  })

  it('rejects unsupported types and unexpected fields', () => {
    expect(() =>
      parsePublicAvailability(
        [
          {
            type: 'administrative',
            start_date: '2026-10-02',
            end_date: '2026-10-02',
            label: 'Administrative',
          },
        ],
        2026
      )
    ).toThrow('unsupported type')

    expect(() =>
      parsePublicAvailability(
        [
          {
            type: 'trip',
            start_date: '2026-10-02',
            end_date: '2026-10-02',
            label: 'Trip',
            notes: 'private',
          },
        ],
        2026
      )
    ).toThrow('unexpected object shape')
  })

  it('rejects malformed, reversed and cross-year ranges', () => {
    expect(() =>
      parsePublicAvailability(
        [
          {
            type: 'trip',
            start_date: '2026-02-30',
            end_date: '2026-03-01',
            label: 'Trip',
          },
        ],
        2026
      )
    ).toThrow('valid YYYY-MM-DD calendar date')

    expect(() =>
      parsePublicAvailability(
        [
          {
            type: 'trip',
            start_date: '2026-10-04',
            end_date: '2026-10-02',
            label: 'Trip',
          },
        ],
        2026
      )
    ).toThrow('on or after start_date')

    expect(() =>
      parsePublicAvailability(
        [
          {
            type: 'winter_holiday',
            start_date: '2026-12-28',
            end_date: '2027-01-03',
            label: 'Winter holiday',
          },
        ],
        2026
      )
    ).toThrow('outside requested year 2026')
  })

  it('preserves the generic unavailable privacy label', () => {
    expect(() =>
      parsePublicAvailability(
        [
          {
            type: 'unavailable',
            start_date: '2026-10-02',
            end_date: '2026-10-02',
            label: 'Sick',
          },
        ],
        2026
      )
    ).toThrow('must be "Unavailable"')
  })

  it('allows overlapping availability ranges', () => {
    expect(() =>
      parsePublicAvailability(
        [
          {
            type: 'trip',
            start_date: '2026-08-10',
            end_date: '2026-08-14',
            label: 'Trip',
          },
          {
            type: 'unavailable',
            start_date: '2026-08-12',
            end_date: '2026-08-13',
            label: 'Unavailable',
          },
        ],
        2026
      )
    ).not.toThrow()
  })

  it('rejects duplicate identical ranges', () => {
    const item = {
      type: 'trip',
      start_date: '2026-08-10',
      end_date: '2026-08-14',
      label: 'Trip',
    }

    expect(() => parsePublicAvailability([item, { ...item }], 2026)).toThrow(
      'duplicate range'
    )
  })
})

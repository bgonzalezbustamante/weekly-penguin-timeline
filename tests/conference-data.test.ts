import { describe, expect, it } from 'vitest'

import { parsePublicConferencePresentations } from '@/lib/conference-data'

const validConference = {
  event_name: 'Faculty of Administration and Economics, Universidad Diego Portales',
  event_short_name: 'UDP Keynote',
  location: 'Santiago',
  presentation_date: '2026-08-07',
  start_date: '2026-08-07',
  end_date: '2026-08-07',
  personal_attendance: true,
  involves_trip: true,
  presentation_title: 'The Politics of Attention',
  authors: ['B. González-Bustamante'],
  presentation_type: 'Keynote',
  url: null,
}

describe('public conference validation', () => {
  it('accepts conference attendance and trip metadata from the public API', () => {
    expect(
      parsePublicConferencePresentations([validConference])
    ).toEqual([validConference])
  })

  it('rejects unexpected public fields', () => {
    expect(() =>
      parsePublicConferencePresentations([
        {
          ...validConference,
          notes: 'private',
        },
      ])
    ).toThrow('unexpected object shape')
  })

  it('requires presentation_date to remain the start_date compatibility alias', () => {
    expect(() =>
      parsePublicConferencePresentations([
        {
          ...validConference,
          presentation_date: '2026-08-08',
        },
      ])
    ).toThrow('must equal start_date')
  })

  it('rejects reversed conference ranges', () => {
    expect(() =>
      parsePublicConferencePresentations([
        {
          ...validConference,
          start_date: '2026-08-08',
          presentation_date: '2026-08-08',
          end_date: '2026-08-07',
        },
      ])
    ).toThrow('on or after start_date')
  })

  it('requires a trip to imply personal attendance', () => {
    expect(() =>
      parsePublicConferencePresentations([
        {
          ...validConference,
          personal_attendance: false,
          involves_trip: true,
        },
      ])
    ).toThrow('requires personal_attendance')
  })

  it('accepts a personally attended conference without a trip', () => {
    expect(
      parsePublicConferencePresentations([
        {
          ...validConference,
          involves_trip: false,
        },
      ])[0]
    ).toMatchObject({
      personal_attendance: true,
      involves_trip: false,
    })
  })
})

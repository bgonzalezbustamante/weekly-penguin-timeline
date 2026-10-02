import type { SpecialDate } from '@/types/timeline'

/**
 * Manual presentation overrides.
 *
 * Exact dates or inclusive ranges can be added here without touching
 * the timeline resolver. An explicit override takes precedence over
 * the Sunday presentation.
 */
export const specialDates: SpecialDate[] = [
  // Examples:
  // {
  //   date: '2027-03-26',
  //   type: 'sunday',
  //   label: 'Good Friday',
  // },
  // {
  //   from: '2026-12-21',
  //   to: '2027-01-03',
  //   type: 'winter-holiday',
  //   label: 'Winter holiday',
  // },
  // {
  //   from: '2027-07-19',
  //   to: '2027-08-08',
  //   type: 'summer-holiday',
  //   label: 'Summer holiday',
  // },
  // {
  //   date: '2027-03-12',
  //   type: 'trip',
  //   label: 'Trip',
  // },
]

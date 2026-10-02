import type { SpecialDate } from '@/types/timeline'

/**
 * Manual presentation overrides.
 * sunday
 * winter-holiday
 * summer-holiday
 * trip
 * sick
 */
export const specialDates: SpecialDate[] = [
  {
    from: '2026-12-24',
    to: '2026-12-24',
    type: 'sunday',
    label: 'Christmas Eve',
  },
]

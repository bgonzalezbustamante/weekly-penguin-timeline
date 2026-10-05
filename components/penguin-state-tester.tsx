'use client'

import { useMemo, useState } from 'react'

import PenguinSprite from '@/components/penguin-sprite'
import {
  resolveCoffeeBucket,
  resolveWorkBucket,
} from '@/lib/timeline'
import type { PenguinMode } from '@/types/timeline'

const WORK_LABELS = {
  zero: '0h',
  light: '<4h',
  normal: '4–8h',
  heavy: '8–10h',
  'very-heavy': '10–12h',
  extreme: '12h+',
} as const

const COFFEE_LABELS = {
  zero: '0',
  light: '1–2',
  normal: '3–4',
  heavy: '5–7',
  'very-heavy': '8–10',
  extreme: '11+',
} as const

type SpecialTesterMode =
  | 'sunday'
  | 'winter-holiday'
  | 'summer-holiday'
  | 'trip'
  | 'conference'
  | 'unavailable'

const SPECIAL_STATES: Array<{
  mode: SpecialTesterMode
  label: string
}> = [
  { mode: 'sunday', label: 'Sunday' },
  { mode: 'winter-holiday', label: 'Winter holiday' },
  { mode: 'summer-holiday', label: 'Summer holiday' },
  { mode: 'trip', label: 'Trip' },
  { mode: 'conference', label: 'Conference' },
  { mode: 'unavailable', label: 'Unavailable' },
]

export default function PenguinStateTester() {
  const [hours, setHours] = useState(6.5)
  const [coffees, setCoffees] = useState(4)
  const [specialMode, setSpecialMode] =
    useState<SpecialTesterMode | null>(null)

  const state = useMemo(() => {
    const workBucket = resolveWorkBucket(Math.round(hours * 60))
    const coffeeBucket = resolveCoffeeBucket(coffees)
    const mode: PenguinMode = specialMode ?? 'activity'
    const specialLabel =
      SPECIAL_STATES.find((item) => item.mode === specialMode)?.label ?? null

    return {
      workBucket,
      coffeeBucket,
      workLabel: WORK_LABELS[workBucket],
      coffeeLabel: COFFEE_LABELS[coffeeBucket],
      mode,
      specialLabel,
    }
  }, [hours, coffees, specialMode])

  return (
    <section className="state-tester" aria-labelledby="state-tester-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Interactive test</p>
          <h2 id="state-tester-title">Penguin state tester</h2>
          <p className="section-intro section-intro-wide">
            Change working time and coffee count, or select a special state,
            to inspect the exact penguin used by the weekly timeline.
          </p>
        </div>
      </div>

      <div className="tester-grid">
        <div className="tester-controls">
          <div className={`control-block${specialMode ? ' is-overridden' : ''}`}>
            <div className="control-header">
              <label htmlFor="hours-test">Working hours</label>
              <strong>{hours.toFixed(hours % 1 === 0 ? 0 : 1)}h</strong>
            </div>
            <input
              id="hours-test"
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
            />
          </div>

          <div className={`control-block${specialMode ? ' is-overridden' : ''}`}>
            <div className="control-header">
              <label htmlFor="coffee-test">Coffee count</label>
              <strong>{coffees}</strong>
            </div>
            <input
              id="coffee-test"
              type="range"
              min="0"
              max="14"
              step="1"
              value={coffees}
              onChange={(event) => setCoffees(Number(event.target.value))}
            />
          </div>

          <div
            className="special-state-panel"
            role="group"
            aria-labelledby="special-state-title"
          >
            <p className="special-state-title" id="special-state-title">
              Special state
            </p>
            <p className="special-state-help">
              A special state overrides the work and coffee illustration.
              Select one, or clear it to return to the normal combined state.
            </p>
            <div className="special-state-options">
              {SPECIAL_STATES.map((item) => (
                <label className="special-state-option" key={item.mode}>
                  <input
                    type="checkbox"
                    checked={specialMode === item.mode}
                    onChange={(event) =>
                      setSpecialMode(event.target.checked ? item.mode : null)
                    }
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="tester-readout" aria-live="polite">
            {state.specialLabel ? (
              <span className="tester-state-chip">
                Special <strong>{state.specialLabel}</strong>
              </span>
            ) : (
              <>
                <span className="tester-state-chip">
                  Work <strong>{state.workLabel}</strong>
                </span>
                <span className="tester-state-chip">
                  Coffee <strong>{state.coffeeLabel}</strong>
                </span>
              </>
            )}
          </div>
        </div>

        <div className="tester-preview">
          <PenguinSprite
            mode={state.mode}
            workBucket={state.workBucket}
            coffeeBucket={state.coffeeBucket}
            label={
              state.specialLabel
                ? `Test state: ${state.specialLabel}`
                : `Test state: ${state.workLabel}, ${state.coffeeLabel} coffees`
            }
            large
          />
        </div>
      </div>
    </section>
  )
}

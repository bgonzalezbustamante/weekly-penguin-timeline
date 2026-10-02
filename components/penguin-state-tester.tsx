'use client'

import { useMemo, useState } from 'react'

import PenguinSprite from '@/components/penguin-sprite'
import {
  resolveCoffeeBucket,
  resolveWorkBucket,
} from '@/lib/timeline'

const WORK_LABELS = {
  zero: '0h',
  'under-4': '<4h',
  '4-6': '4–6h',
  '6-8': '6–8h',
  '8-10': '8–10h',
  '10-plus': '10h+',
} as const

const COFFEE_LABELS = {
  zero: '0',
  '2-4': '2–4',
  '4-6': '4–6',
  '8-10': '8–10',
  '10-plus': '10+',
} as const

export default function PenguinStateTester() {
  const [hours, setHours] = useState(6.5)
  const [coffees, setCoffees] = useState(4)

  const state = useMemo(() => {
    const workBucket = resolveWorkBucket(Math.round(hours * 60))
    const coffeeBucket = resolveCoffeeBucket(coffees)

    return {
      workBucket,
      coffeeBucket,
      workLabel: WORK_LABELS[workBucket],
      coffeeLabel: COFFEE_LABELS[coffeeBucket],
      id: `work-${workBucket}__coffee-${coffeeBucket}`,
    }
  }, [hours, coffees])

  return (
    <section className="state-tester" aria-labelledby="state-tester-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Interactive test</p>
          <h2 id="state-tester-title">Penguin state tester</h2>
          <p className="section-intro">
            Change working time and coffee count to inspect the exact activity
            state used by the weekly timeline.
          </p>
        </div>
      </div>

      <div className="tester-grid">
        <div className="tester-controls">
          <div className="control-block">
            <div className="control-header">
              <label htmlFor="hours-test">Working hours</label>
              <strong>{hours.toFixed(hours % 1 === 0 ? 0 : 1)}h</strong>
            </div>
            <input
              id="hours-test"
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
            />
          </div>

          <div className="control-block">
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

          <div className="tester-readout" aria-live="polite">
            <span className="tester-state-chip">
              Work <strong>{state.workLabel}</strong>
            </span>
            <span className="tester-state-chip">
              Coffee <strong>{state.coffeeLabel}</strong>
            </span>
            <span className="tester-state-chip">
              State <strong>{state.id}</strong>
            </span>
          </div>
        </div>

        <div className="tester-preview">
          <PenguinSprite
            mode="activity"
            workBucket={state.workBucket}
            coffeeBucket={state.coffeeBucket}
            label={`Test state: ${state.workLabel}, ${state.coffeeLabel} coffees`}
            large
          />
        </div>
      </div>
    </section>
  )
}

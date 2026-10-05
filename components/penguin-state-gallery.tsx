import PenguinSprite from '@/components/penguin-sprite'
import {
  COFFEE_BUCKETS,
  WORK_BUCKETS,
} from '@/lib/penguin-assets'
import type {
  CoffeeBucket,
  PenguinMode,
  WorkBucket,
} from '@/types/timeline'

const WORK_LABELS: Record<WorkBucket, string> = {
  zero: '0h',
  light: '<4h',
  normal: '4–8h',
  heavy: '8–10h',
  'very-heavy': '10–12h',
  extreme: '12h+',
}

const COFFEE_LABELS: Record<CoffeeBucket, string> = {
  zero: '0',
  light: '1–2',
  normal: '3–4',
  heavy: '5–7',
  'very-heavy': '8–10',
  extreme: '11+',
}

const SPECIAL_STATES: Array<{
  mode: Exclude<PenguinMode, 'activity' | 'upcoming'>
  label: string
}> = [
  { mode: 'sunday', label: 'Sunday' },
  { mode: 'teaching', label: 'Teaching Saturdays' },
  { mode: 'saturday', label: 'Free Saturdays' },
  { mode: 'trip', label: 'Trip' },
  { mode: 'conference', label: 'Conference' },
  { mode: 'winter-holiday', label: 'Winter holiday' },
  { mode: 'summer-holiday', label: 'Summer holiday' },
  { mode: 'unavailable', label: 'Unavailable' },
]

export default function PenguinStateGallery() {
  return (
    <section className="state-gallery" aria-labelledby="state-gallery-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Visual QA</p>
          <h2 id="state-gallery-title">Penguin state matrix</h2>
          <p className="section-intro section-intro-wide">
            The complete approved 6 × 6 activity matrix, followed by eight
            special and contextual states in two rows of four. This view makes
            progression and visual drift easy to inspect.
          </p>
        </div>
      </div>

      <div className="state-matrix-scroll" tabIndex={0}>
        <div
          className="state-matrix-grid"
          role="table"
          aria-label="Work and coffee penguin state matrix"
        >
          <div className="matrix-corner" role="columnheader">
            Work / coffee
          </div>
          {COFFEE_BUCKETS.map((coffeeBucket) => (
            <div
              className="matrix-column-heading"
              role="columnheader"
              key={coffeeBucket}
            >
              {COFFEE_LABELS[coffeeBucket]}
            </div>
          ))}

          {WORK_BUCKETS.flatMap((workBucket) => [
            <div
              className="matrix-row-heading"
              role="rowheader"
              key={`label-${workBucket}`}
            >
              {WORK_LABELS[workBucket]}
            </div>,
            ...COFFEE_BUCKETS.map((coffeeBucket) => (
              <div
                className="matrix-state-cell"
                role="cell"
                key={`${workBucket}-${coffeeBucket}`}
              >
                <PenguinSprite
                  mode="activity"
                  workBucket={workBucket}
                  coffeeBucket={coffeeBucket}
                  label={`${WORK_LABELS[workBucket]} work, ${COFFEE_LABELS[coffeeBucket]} coffees`}
                />
                <span>
                  {WORK_LABELS[workBucket]} · {COFFEE_LABELS[coffeeBucket]}
                </span>
              </div>
            )),
          ])}
        </div>
      </div>

      <div className="special-gallery" aria-label="Special and contextual penguin states">
        {SPECIAL_STATES.map((state) => (
          <div className="special-gallery-item" key={state.mode}>
            <article className="special-gallery-card">
              <PenguinSprite
                mode={state.mode}
                workBucket="zero"
                coffeeBucket="zero"
                label={state.label}
              />
              <strong>{state.label}</strong>
            </article>
            {state.mode === 'sunday' ? (
              <span className="special-gallery-note">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  focusable="false"
                >
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 10.5v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="7.3" r="1.1" fill="currentColor" />
                </svg>
                <span>
                  Also used for major, widely observed Catholic celebrations.
                </span>
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

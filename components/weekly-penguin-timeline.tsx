import PenguinSprite from '@/components/penguin-sprite'
import { formatMinutes } from '@/lib/timeline'
import type { TimelineDay } from '@/types/timeline'

export default function WeeklyPenguinTimeline({
  days,
}: {
  days: TimelineDay[]
}) {
  return (
    <section className="timeline-section" aria-labelledby="weekly-timeline-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Seven-day view</p>
          <h2 id="weekly-timeline-title">Weekly timeline</h2>
          <p className="section-intro">
            Daily net working time and coffee counts translated into one
            penguin state per day.
          </p>
        </div>
      </div>

      <div className="timeline-scroll" tabIndex={0}>
        <ol className="weekly-timeline">
          {days.map((day) => {
            const specialText =
              day.mode === 'sunday'
                ? 'Sunday'
                : day.specialLabel

            return (
              <li
                className={[
                  'day-card',
                  day.isToday ? 'is-today' : '',
                  day.isFuture ? 'is-future' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={day.date}
              >
                <div className="day-header">
                  <div>
                    <span className="weekday">{day.weekday}</span>
                    <span className="date-label">{day.date}</span>
                  </div>
                  {day.isToday ? <span className="today-chip">Today</span> : null}
                </div>

                <div className="metric-row" aria-label="Daily indicators">
                  <span className="metric-chip work-chip">
                    <span aria-hidden="true">◷</span>
                    {day.isFuture ? '—' : day.workLabel}
                  </span>
                  <span className="metric-chip coffee-chip">
                    <span aria-hidden="true">☕</span>
                    {day.isFuture ? '—' : day.coffeeLabel}
                  </span>
                </div>

                <div className="sprite-stage">
                  <PenguinSprite
                    mode={day.mode}
                    workBucket={day.workBucket}
                    coffeeBucket={day.coffeeBucket}
                    label={`${day.weekday}: ${specialText ?? `${day.workLabel}, ${day.coffeeLabel} coffees`}`}
                  />
                </div>

                <div className="day-footer">
                  {specialText ? (
                    <span className="footer-status">{specialText}</span>
                  ) : day.isFuture ? (
                    <span className="footer-status muted">Upcoming</span>
                  ) : (
                    <>
                      <strong>{formatMinutes(day.netMinutes)}</strong>
                      <span>
                        {day.coffeeCount}{' '}
                        {day.coffeeCount === 1 ? 'coffee' : 'coffees'}
                        {day.isToday ? ' · so far' : ''}
                      </span>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="timeline-legend" aria-label="Timeline legend">
        <span><i className="legend-dot work-dot" /> Work</span>
        <span><i className="legend-dot coffee-dot" /> Coffee</span>
        <span><i className="legend-dot special-dot" /> Manual override / Sunday</span>
      </div>
    </section>
  )
}

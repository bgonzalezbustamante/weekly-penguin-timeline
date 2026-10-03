'use client'

import { useEffect, useRef, useState } from 'react'

import PenguinSprite from '@/components/penguin-sprite'
import { formatDisplayDate, formatMinutes } from '@/lib/timeline'
import type { TimelineWeek } from '@/types/timeline'

function compactDate(value: string) {
  return formatDisplayDate(value).replace(/\s+\d{4}$/, '')
}

function relativeWeekLabel(offset: number) {
  if (offset === 0) return 'Current'
  if (offset < 0) {
    const weeks = Math.abs(offset)
    return `${weeks}w ago`
  }
  return `in ${offset}w`
}

export default function WeeklyPenguinTimeline({
  weeks,
}: {
  weeks: TimelineWeek[]
}) {
  const currentIndex = Math.max(
    0,
    weeks.findIndex((week) => week.isCurrentWeek)
  )
  const [selectedIndex, setSelectedIndex] = useState(currentIndex)
  const pageRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedWeek = weeks[selectedIndex]

  useEffect(() => {
    pageRefs.current[selectedIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [selectedIndex])

  if (!selectedWeek) return null

  return (
    <section className="timeline-section" aria-labelledby="weekly-timeline-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Seven-day view</p>
          <h2 id="weekly-timeline-title">Weekly timeline</h2>
          <p className="section-intro section-intro-wide">
            Daily net working time and coffee counts translated into one
            penguin state per day. Browse roughly three months before and
            three months after the current date.
          </p>
        </div>
      </div>

      <div className="week-pagination-scroll">
        <nav className="week-pagination" aria-label="Weekly timeline pagination">
          <button
            className="week-nav-button"
            type="button"
            onClick={() => setSelectedIndex((index) => Math.max(0, index - 1))}
            disabled={selectedIndex === 0}
            aria-label="Show older week"
          >
            <span aria-hidden="true">←</span>
            Older
          </button>

          <div className="week-pages">
            {weeks.map((week, index) => {
              const selected = index === selectedIndex

              return (
                <button
                  className={[
                    'week-page-button',
                    selected ? 'is-selected' : '',
                    week.isCurrentWeek ? 'is-current-week' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  type="button"
                  key={week.startDate}
                  ref={(element) => {
                    pageRefs.current[index] = element
                  }}
                  onClick={() => setSelectedIndex(index)}
                  aria-current={selected ? 'page' : undefined}
                  aria-label={`Show week ${formatDisplayDate(week.startDate)} to ${formatDisplayDate(week.endDate)}`}
                >
                  <span>{compactDate(week.startDate)}</span>
                  <small>{relativeWeekLabel(week.offset)}</small>
                </button>
              )
            })}
          </div>

          <button
            className="week-nav-button"
            type="button"
            onClick={() =>
              setSelectedIndex((index) => Math.min(weeks.length - 1, index + 1))
            }
            disabled={selectedIndex === weeks.length - 1}
            aria-label="Show newer week"
          >
            Newer
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>

      <div className="selected-week-heading" aria-live="polite">
        <strong>
          {formatDisplayDate(selectedWeek.startDate)} –{' '}
          {formatDisplayDate(selectedWeek.endDate)}
        </strong>
        {selectedWeek.isCurrentWeek ? <span>Current week</span> : null}
      </div>

      <div className="timeline-scroll" tabIndex={0}>
        <ol className="weekly-timeline">
          {selectedWeek.days.map((day) => {
            const specialText = day.specialLabel

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
                    <span className="date-label">{formatDisplayDate(day.date)}</span>
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
                    isFuture={day.isFuture}
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
        <span><i className="legend-dot special-dot" /> Special state</span>
      </div>
    </section>
  )
}

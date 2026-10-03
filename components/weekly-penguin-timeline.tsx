'use client'

import { useState } from 'react'

import PenguinSprite from '@/components/penguin-sprite'
import { formatDisplayDate, formatMinutes } from '@/lib/timeline'
import type { TimelineWeek } from '@/types/timeline'

function compactDate(value: string) {
  return formatDisplayDate(value).replace(/\s+\d{4}$/, '')
}

function relativeDayLabel(
  startIndex: number,
  currentDayStartIndex: number
) {
  const offset = startIndex - currentDayStartIndex

  if (offset === 0) return 'Today'
  if (offset < 0) {
    const days = Math.abs(offset)
    return `${days}d ago`
  }

  return `in ${offset}d`
}

export default function WeeklyPenguinTimeline({
  weeks,
}: {
  weeks: TimelineWeek[]
}) {
  const currentWeekIndex = Math.max(
    0,
    weeks.findIndex((week) => week.isCurrentWeek)
  )
  const allDays = weeks.flatMap((week) => week.days)
  const maxStartIndex = Math.max(0, allDays.length - 7)
  const currentStartIndex = Math.min(currentWeekIndex * 7, maxStartIndex)
  const todayIndex = allDays.findIndex((day) => day.isToday)
  const currentDayStartIndex =
    todayIndex >= 0
      ? Math.min(todayIndex, maxStartIndex)
      : currentStartIndex
  const availableStartCount = maxStartIndex + 1
  const visiblePageCount = Math.min(9, availableStartCount)
  const maxWindowStart = Math.max(
    0,
    availableStartCount - visiblePageCount
  )
  const initialWindowStart = Math.min(
    maxWindowStart,
    Math.max(
      0,
      currentStartIndex - Math.floor(visiblePageCount / 2)
    )
  )
  const [selectedStartIndex, setSelectedStartIndex] =
    useState(currentStartIndex)
  const [windowStart, setWindowStart] = useState(initialWindowStart)
  const selectedDays = allDays.slice(
    selectedStartIndex,
    selectedStartIndex + 7
  )
  const visibleStartIndices = Array.from(
    { length: visiblePageCount },
    (_, index) => windowStart + index
  )

  function selectStartIndex(nextIndex: number) {
    const clampedIndex = Math.min(
      maxStartIndex,
      Math.max(0, nextIndex)
    )

    setSelectedStartIndex(clampedIndex)
    setWindowStart((currentWindowStart) => {
      const currentWindowEnd =
        currentWindowStart + visiblePageCount - 1

      if (clampedIndex < currentWindowStart) {
        return clampedIndex
      }

      if (clampedIndex > currentWindowEnd) {
        return Math.min(
          maxWindowStart,
          clampedIndex - visiblePageCount + 1
        )
      }

      return currentWindowStart
    })
  }

  function selectCurrentWeek() {
    setSelectedStartIndex(currentStartIndex)
    setWindowStart(initialWindowStart)
  }
  const selectedStartDate = selectedDays[0]?.date
  const selectedEndDate = selectedDays[selectedDays.length - 1]?.date
  const isCurrentWeek = selectedStartIndex === currentStartIndex

  if (!selectedStartDate || !selectedEndDate) return null

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
          <div className="week-nav-stack">
            <button
              className="week-jump-button week-current-day-button"
              type="button"
              onClick={() => selectStartIndex(currentDayStartIndex)}
              disabled={selectedStartIndex === currentDayStartIndex}
            >
              Current day
            </button>
            <button
              className="week-nav-button"
              type="button"
              onClick={() =>
                selectStartIndex(selectedStartIndex - 1)
              }
              disabled={selectedStartIndex === 0}
              aria-label="Move seven-day window back one day"
            >
              <span aria-hidden="true">←</span>
              Previous day
            </button>
          </div>

          <div className="week-pages">
            {visibleStartIndices.map((startIndex) => {
              const startDay = allDays[startIndex]
              const selected = startIndex === selectedStartIndex
              const isCurrentDay = startIndex === currentDayStartIndex

              if (!startDay) return null

              return (
                <button
                  className={[
                    'week-page-button',
                    selected ? 'is-selected' : '',
                    isCurrentDay ? 'is-current-day' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  type="button"
                  key={startDay.date}
                  onClick={() => selectStartIndex(startIndex)}
                  aria-current={selected ? 'page' : undefined}
                  aria-label={`Show seven-day window starting ${formatDisplayDate(startDay.date)}`}
                >
                  <span>{compactDate(startDay.date)}</span>
                  <small>
                    {relativeDayLabel(startIndex, currentDayStartIndex)}
                  </small>
                </button>
              )
            })}
          </div>

          <div className="week-nav-stack">
            <button
              className="week-jump-button week-current-week-button"
              type="button"
              onClick={selectCurrentWeek}
              disabled={
                selectedStartIndex === currentStartIndex &&
                windowStart === initialWindowStart
              }
            >
              Current week
            </button>
            <button
              className="week-nav-button"
              type="button"
              onClick={() =>
                selectStartIndex(selectedStartIndex + 1)
              }
              disabled={selectedStartIndex === maxStartIndex}
              aria-label="Move seven-day window forward one day"
            >
              Next day
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </nav>
        <div
          className="week-pagination-secondary"
          aria-label="Weekly timeline shortcuts"
        >
          <button
            className="week-jump-button week-range-first"
            type="button"
            onClick={() => selectStartIndex(0)}
            disabled={selectedStartIndex === 0}
          >
            First
          </button>

          <div className="week-pagination-secondary-group">
            <button
              className="week-jump-button"
              type="button"
              onClick={() => selectStartIndex(selectedStartIndex - 7)}
              disabled={selectedStartIndex === 0}
              aria-label="Move seven-day window back one week"
            >
              <span aria-hidden="true">←</span>
              Previous week
            </button>
            <button
              className="week-jump-button"
              type="button"
              onClick={() => selectStartIndex(selectedStartIndex + 7)}
              disabled={selectedStartIndex === maxStartIndex}
              aria-label="Move seven-day window forward one week"
            >
              Next week
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <button
            className="week-jump-button week-range-last"
            type="button"
            onClick={() => selectStartIndex(maxStartIndex)}
            disabled={selectedStartIndex === maxStartIndex}
          >
            Last
          </button>
        </div>
      </div>

      <div className="selected-week-heading" aria-live="polite">
        <strong>
          {formatDisplayDate(selectedStartDate)} –{' '}
          {formatDisplayDate(selectedEndDate)}
        </strong>
        {isCurrentWeek ? <span>Current week</span> : null}
      </div>

      <div className="timeline-scroll" tabIndex={0}>
        <ol className="weekly-timeline">
          {selectedDays.map((day) => {
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

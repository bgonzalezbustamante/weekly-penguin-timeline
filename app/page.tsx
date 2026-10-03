import PenguinStateGallery from '@/components/penguin-state-gallery'
import PenguinStateTester from '@/components/penguin-state-tester'
import ReleaseNotes from '@/components/release-notes'
import WeeklyPenguinTimeline from '@/components/weekly-penguin-timeline'
import { getConfiguredSpecialDates } from '@/content/special-dates'
import { getPublicAvailability } from '@/lib/availability'
import {
  buildTimelineWeeks,
  yearsForTimelineWindow,
  yearsForWorkAnalyticsWindow,
} from '@/lib/timeline'
import { getPublicTeachingSettings } from '@/lib/teaching-settings'
import { getPublicWorkAnalytics } from '@/lib/work-analytics'

export const dynamic = 'force-dynamic'

const TIME_ZONE = 'Europe/Amsterdam'
const PAST_WEEKS = 4
const FUTURE_WEEKS = 4

async function loadTimelineWindow(now: Date) {
  const calendarYears = yearsForTimelineWindow(
    now,
    TIME_ZONE,
    PAST_WEEKS,
    FUTURE_WEEKS
  )
  const analyticsYears = yearsForWorkAnalyticsWindow(
    now,
    TIME_ZONE,
    PAST_WEEKS,
    FUTURE_WEEKS
  )
  const latestAvailabilityYear = now.getUTCFullYear() + 5
  const availabilityYears = calendarYears.filter(
    (year) => year >= 2000 && year <= latestAvailabilityYear
  )

  try {
    const [
      analyticsResults,
      availabilityResults,
      teachingSettings,
    ] = await Promise.all([
      Promise.all(
        analyticsYears.map((year) => getPublicWorkAnalytics(year))
      ),
      Promise.all(
        availabilityYears.map((year) => getPublicAvailability(year))
      ),
      getPublicTeachingSettings(),
    ])

    return {
      days: analyticsResults.flatMap((result) => result.days),
      availability: availabilityResults.flat(),
      teachingSeasonActive: teachingSettings.teaching_season_active,
      error: null,
      calendarYears,
    }
  } catch (error) {
    return {
      days: [],
      availability: [],
      teachingSeasonActive: false,
      error:
        error instanceof Error
          ? error.message
          : 'The Academic API could not be loaded.',
      calendarYears,
    }
  }
}

export default async function HomePage() {
  const now = new Date()
  const {
    days,
    availability,
    teachingSeasonActive,
    error,
    calendarYears,
  } = await loadTimelineWindow(now)
  const timelineWeeks = error
    ? []
    : buildTimelineWeeks({
        now,
        days,
        specialDates: getConfiguredSpecialDates(
          calendarYears,
          undefined,
          availability
        ),
        teachingSeasonActive,
        timeZone: TIME_ZONE,
        pastWeeks: PAST_WEEKS,
        futureWeeks: FUTURE_WEEKS,
      })

  return (
    <main>
      <section className="hero">
        <div className="shell hero-inner">
          <p className="eyebrow">Proof of concept</p>
          <h1>Weekly Penguin Timeline</h1>
          <p className="hero-copy">
            A reusable Next.js component that turns seven days of public
            working-time and coffee data into a compact visual timeline.
            Sundays, public availability, configured celebrations and
            manual dates can override the normal activity state.
          </p>
          <div
            className={`source-note${error ? ' is-offline' : ' is-online'}`}
            aria-label={error ? 'Academic API unavailable' : 'Academic API connected'}
          >
            <span>Data source</span>
            <strong>
              <a
                className="source-link"
                href="https://dashboard.bgonzalezbustamante.com/api"
                target="_blank"
                rel="noreferrer"
              >
                <i
                  className={`connection-dot${error ? ' is-offline' : ' is-online'}`}
                  aria-hidden="true"
                />
                Academic API
              </a>
            </strong>
          </div>
        </div>
      </section>

      <div className="shell">
        {error ? (
          <section className="timeline-section" aria-labelledby="weekly-timeline-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Seven-day view</p>
                <h2 id="weekly-timeline-title">Weekly timeline</h2>
              </div>
            </div>
            <div className="data-error" role="status">
              <strong>Live timeline unavailable.</strong>
              <span>{error}</span>
            </div>
          </section>
        ) : (
          <WeeklyPenguinTimeline weeks={timelineWeeks} />
        )}

        <PenguinStateTester />
        <PenguinStateGallery />

        <section className="notes-grid" aria-label="Proof-of-concept notes">
          <article>
            <p className="eyebrow">State engine</p>
            <h2>36 activity combinations</h2>
            <p>
              Six working-time bands combine with six coffee bands. Working
              time and coffee jointly increase the visible workload
              and stress.
            </p>
          </article>
          <article>
            <p className="eyebrow">Overrides</p>
            <h2>Special dates stay configurable</h2>
            <p>
              Trips, Winter/Summer holidays and generic unavailable periods
              are loaded from the privacy-safe Academic API. Manual overrides
              remain available, while a switch enables widely observed fixed
              Catholic celebrations.
            </p>
          </article>
          <article>
            <p className="eyebrow">Integration</p>
            <h2>Designed to transplant</h2>
            <p>
              Data retrieval, state resolution and presentation are separate,
              so the component can later move into the Academic Website
              without coupling it to this demonstration page.
            </p>
          </article>
        </section>

        <ReleaseNotes />
      </div>
    </main>
  )
}

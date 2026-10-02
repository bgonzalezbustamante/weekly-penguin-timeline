import WeeklyPenguinTimeline from '@/components/weekly-penguin-timeline'
import { specialDates } from '@/content/special-dates'
import {
  buildWeeklyTimeline,
  yearsForCurrentWeek,
} from '@/lib/timeline'
import { getPublicWorkAnalytics } from '@/lib/work-analytics'
import type { PublicWorkDay } from '@/types/timeline'

export const revalidate = 300

const TIME_ZONE = 'Europe/Amsterdam'

const fallbackDays: PublicWorkDay[] = [
  { date: '2026-09-28', net_minutes: 510, coffee_count: 5 },
  { date: '2026-09-29', net_minutes: 390, coffee_count: 3 },
  { date: '2026-09-30', net_minutes: 625, coffee_count: 9 },
  { date: '2026-10-01', net_minutes: 285, coffee_count: 4 },
  { date: '2026-10-02', net_minutes: 190, coffee_count: 2 },
]

async function loadCurrentWeek() {
  const years = yearsForCurrentWeek(new Date(), TIME_ZONE)

  try {
    const results = await Promise.all(
      years.map((year) => getPublicWorkAnalytics(year))
    )

    return {
      days: results.flatMap((result) => result.days),
      source: 'Academic API',
    }
  } catch {
    return {
      days: fallbackDays,
      source: 'Built-in demo data',
    }
  }
}

export default async function HomePage() {
  const { days, source } = await loadCurrentWeek()
  const timeline = buildWeeklyTimeline({
    days,
    specialDates,
    timeZone: TIME_ZONE,
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
            Sundays and manually configured dates can override the normal
            activity state.
          </p>
          <div className="source-note">
            <span>Data source</span>
            <strong>{source}</strong>
          </div>
        </div>
      </section>

      <div className="shell">
        <WeeklyPenguinTimeline days={timeline} />

        <section className="notes-grid" aria-label="Proof-of-concept notes">
          <article>
            <p className="eyebrow">State engine</p>
            <h2>30 activity combinations</h2>
            <p>
              Six working-time bands combine with five coffee bands. The
              penguin pose is driven by work intensity while coffee adds a
              second visual signal.
            </p>
          </article>
          <article>
            <p className="eyebrow">Overrides</p>
            <h2>Special dates stay manual</h2>
            <p>
              Winter holidays, summer holidays, trips and sickness are kept in
              one small configuration file. Explicit overrides take priority
              over the Sunday state.
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
      </div>
    </main>
  )
}

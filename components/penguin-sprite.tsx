import type {
  CoffeeBucket,
  PenguinMode,
  WorkBucket,
} from '@/types/timeline'

type Props = {
  mode: PenguinMode
  workBucket: WorkBucket
  coffeeBucket: CoffeeBucket
  label: string
}

const coffeeLevel: Record<CoffeeBucket, number> = {
  zero: 0,
  '2-4': 1,
  '4-6': 2,
  '8-10': 3,
  '10-plus': 4,
}

function CoffeeCups({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <g aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <g
          key={index}
          transform={`translate(${108 + (index % 2) * 18} ${100 + Math.floor(index / 2) * 15})`}
        >
          <rect width="13" height="9" rx="2" fill="var(--coral)" />
          <rect x="3" y="2" width="7" height="3" fill="var(--paper)" />
          <rect
            x="12"
            y="2"
            width="5"
            height="5"
            rx="2"
            fill="none"
            stroke="var(--coral)"
            strokeWidth="2"
          />
        </g>
      ))}
    </g>
  )
}

function ActivityProp({ workBucket }: { workBucket: WorkBucket }) {
  if (workBucket === 'zero') {
    return (
      <g aria-hidden="true">
        <rect x="45" y="118" width="70" height="6" fill="var(--stone)" />
        <rect x="57" y="124" width="46" height="5" fill="var(--sky)" />
      </g>
    )
  }

  if (workBucket === 'under-4' || workBucket === '4-6') {
    return (
      <g aria-hidden="true">
        <path
          d="M38 110 L78 101 L82 126 L42 134 Z"
          fill="var(--paper)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <path
          d="M82 101 L122 110 L118 134 L82 126 Z"
          fill="var(--paper)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <path d="M82 104 V126" stroke="var(--aqua)" strokeWidth="3" />
      </g>
    )
  }

  return (
    <g aria-hidden="true">
      <rect
        x="40"
        y="101"
        width="80"
        height="44"
        rx="4"
        fill="var(--blue-dark)"
        stroke="var(--blue)"
        strokeWidth="4"
      />
      <rect x="48" y="109" width="64" height="27" fill="var(--sky)" />
      <rect x="68" y="119" width="24" height="4" fill="var(--aqua)" />
      {workBucket === '10-plus' ? (
        <>
          <rect x="27" y="94" width="23" height="5" fill="var(--coral)" />
          <rect x="113" y="87" width="27" height="5" fill="var(--aqua)" />
          <rect x="21" y="84" width="22" height="5" fill="var(--blue)" />
        </>
      ) : null}
    </g>
  )
}

function SpecialProp({ mode }: { mode: PenguinMode }) {
  if (mode === 'winter-holiday') {
    return (
      <g aria-hidden="true">
        <rect x="54" y="30" width="52" height="8" fill="var(--coral)" />
        <rect x="62" y="20" width="36" height="12" fill="var(--sky)" />
        <rect x="96" y="17" width="8" height="8" fill="var(--coral)" />
        <path d="M46 96 H114 V106 H46 Z" fill="var(--aqua)" />
      </g>
    )
  }

  if (mode === 'summer-holiday') {
    return (
      <g aria-hidden="true">
        <rect x="51" y="52" width="25" height="9" fill="var(--blue-dark)" />
        <rect x="84" y="52" width="25" height="9" fill="var(--blue-dark)" />
        <rect x="76" y="55" width="8" height="3" fill="var(--blue-dark)" />
        <circle cx="128" cy="31" r="11" fill="var(--coral)" />
      </g>
    )
  }

  if (mode === 'trip') {
    return (
      <g aria-hidden="true">
        <rect
          x="106"
          y="105"
          width="34"
          height="36"
          rx="4"
          fill="var(--aqua)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <path
          d="M115 105 V96 H131 V105"
          fill="none"
          stroke="var(--blue)"
          strokeWidth="4"
        />
      </g>
    )
  }

  if (mode === 'sick') {
    return (
      <g aria-hidden="true">
        <rect x="36" y="111" width="88" height="28" fill="var(--sky)" />
        <rect x="36" y="111" width="88" height="6" fill="var(--coral)" />
        <rect x="111" y="67" width="5" height="35" fill="var(--paper)" />
        <rect x="109" y="63" width="9" height="28" fill="var(--coral)" />
      </g>
    )
  }

  return null
}

export default function PenguinSprite({
  mode,
  workBucket,
  coffeeBucket,
  label,
}: Props) {
  const praying = mode === 'sunday'
  const upcoming = mode === 'upcoming'
  const special =
    mode !== 'activity' && mode !== 'sunday' && mode !== 'upcoming'

  return (
    <svg
      className="penguin-sprite"
      viewBox="0 0 160 160"
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <g opacity={upcoming ? 0.35 : 1}>
        <ellipse cx="80" cy="146" rx="52" ry="6" fill="var(--blue-wash)" />

        <ellipse
          cx="80"
          cy="83"
          rx="48"
          ry="58"
          fill="var(--blue-dark)"
        />
        <ellipse cx="80" cy="88" rx="34" ry="43" fill="var(--paper)" />

        <rect x="43" y="48" width="33" height="27" rx="8" fill="var(--paper)" />
        <rect x="84" y="48" width="33" height="27" rx="8" fill="var(--paper)" />
        <rect
          x="41"
          y="46"
          width="37"
          height="31"
          rx="9"
          fill="none"
          stroke="var(--blue)"
          strokeWidth="5"
        />
        <rect
          x="82"
          y="46"
          width="37"
          height="31"
          rx="9"
          fill="none"
          stroke="var(--blue)"
          strokeWidth="5"
        />
        <rect x="77" y="57" width="6" height="4" fill="var(--blue)" />

        {praying ? (
          <>
            <rect x="53" y="60" width="13" height="3" fill="var(--blue-dark)" />
            <rect x="94" y="60" width="13" height="3" fill="var(--blue-dark)" />
          </>
        ) : (
          <>
            <rect x="56" y="57" width="7" height="10" fill="var(--blue-dark)" />
            <rect x="97" y="57" width="7" height="10" fill="var(--blue-dark)" />
            <rect x="58" y="57" width="2" height="3" fill="var(--paper)" />
            <rect x="99" y="57" width="2" height="3" fill="var(--paper)" />
          </>
        )}

        <path
          d="M72 74 L80 68 L88 74 L80 80 Z"
          fill="var(--coral)"
          stroke="var(--blue)"
          strokeWidth="2"
        />

        {praying ? (
          <>
            <path
              d="M57 102 L76 91 L80 113 L67 123 Z"
              fill="var(--blue-dark)"
            />
            <path
              d="M103 102 L84 91 L80 113 L93 123 Z"
              fill="var(--blue-dark)"
            />
            <rect x="74" y="101" width="12" height="18" fill="var(--paper)" />
            <rect x="44" y="135" width="72" height="5" fill="var(--coral)" />
          </>
        ) : (
          <>
            {!special ? <ActivityProp workBucket={workBucket} /> : null}
            <CoffeeCups count={coffeeLevel[coffeeBucket]} />
            <SpecialProp mode={mode} />
          </>
        )}

        <rect x="52" y="139" width="20" height="8" rx="3" fill="var(--coral)" />
        <rect x="88" y="139" width="20" height="8" rx="3" fill="var(--coral)" />
      </g>

      {upcoming ? (
        <g aria-hidden="true">
          <rect x="69" y="75" width="22" height="5" fill="var(--ash)" />
          <rect x="77" y="67" width="5" height="21" fill="var(--ash)" />
        </g>
      ) : null}
    </svg>
  )
}

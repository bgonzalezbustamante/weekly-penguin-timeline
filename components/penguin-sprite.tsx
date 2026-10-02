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
  large?: boolean
}

const coffeeLevel: Record<CoffeeBucket, number> = {
  zero: 0,
  '2-4': 1,
  '4-6': 2,
  '8-10': 3,
  '10-plus': 4,
}

function PixelSparkles({ intense }: { intense: boolean }) {
  return (
    <g aria-hidden="true" opacity={intense ? 1 : 0.55}>
      <rect x="34" y="39" width="5" height="5" rx="1" fill="var(--aqua)" />
      <rect x="28" y="44" width="17" height="3" rx="1" fill="var(--aqua)" />
      <rect x="35" y="37" width="3" height="19" rx="1" fill="var(--aqua)" />
      {intense ? (
        <>
          <rect x="179" y="35" width="4" height="4" rx="1" fill="var(--coral)" />
          <rect x="173" y="40" width="16" height="3" rx="1" fill="var(--coral)" />
          <rect x="180" y="33" width="3" height="18" rx="1" fill="var(--coral)" />
        </>
      ) : null}
    </g>
  )
}

function CoffeeCups({ count }: { count: number }) {
  if (count === 0) return null

  const positions = [
    { x: 166, y: 119 },
    { x: 172, y: 138 },
    { x: 154, y: 146 },
    { x: 180, y: 157 },
  ]

  return (
    <g aria-hidden="true">
      {positions.slice(0, count).map((position, index) => (
        <g key={index} transform={`translate(${position.x} ${position.y})`}>
          <rect
            x="0"
            y="4"
            width="20"
            height="13"
            rx="4"
            fill="var(--paper)"
            stroke="var(--blue)"
            strokeWidth="3"
          />
          <path
            d="M20 7 H24 C28 7 28 14 24 14 H20"
            fill="none"
            stroke="var(--blue)"
            strokeWidth="3"
          />
          <rect x="4" y="7" width="12" height="4" rx="1" fill="var(--coral)" />
          <rect
            x="6"
            y={index % 2 === 0 ? -2 : -5}
            width="3"
            height="5"
            rx="1"
            fill="var(--aqua)"
            opacity="0.72"
          />
          <rect
            x="12"
            y={index % 2 === 0 ? -5 : -2}
            width="3"
            height="6"
            rx="1"
            fill="var(--aqua)"
            opacity="0.5"
          />
        </g>
      ))}
    </g>
  )
}

function BookStack() {
  return (
    <g aria-hidden="true">
      <rect
        x="19"
        y="144"
        width="47"
        height="11"
        rx="3"
        fill="var(--sky)"
        stroke="var(--blue)"
        strokeWidth="3"
      />
      <rect
        x="24"
        y="133"
        width="44"
        height="11"
        rx="3"
        fill="var(--paper)"
        stroke="var(--blue)"
        strokeWidth="3"
      />
      <rect
        x="16"
        y="122"
        width="48"
        height="11"
        rx="3"
        fill="var(--coral)"
        stroke="var(--blue)"
        strokeWidth="3"
      />
      <rect x="23" y="126" width="30" height="3" fill="var(--paper)" />
      <rect x="31" y="137" width="29" height="3" fill="var(--aqua)" />
      <rect x="27" y="148" width="31" height="3" fill="var(--paper)" />
    </g>
  )
}

function Laptop({ crowded = false }: { crowded?: boolean }) {
  return (
    <g aria-hidden="true">
      <path
        d="M56 119 H149 L144 167 H62 Z"
        fill="var(--blue-dark)"
        stroke="var(--blue)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M65 128 H140 L136 157 H69 Z"
        fill="var(--sky)"
        stroke="var(--paper)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="91" y="139" width="24" height="4" rx="2" fill="var(--aqua)" />
      <rect x="97" y="146" width="15" height="3" rx="1" fill="var(--blue)" />
      <path
        d="M50 168 H153 L147 178 H57 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {crowded ? (
        <>
          <rect
            x="141"
            y="105"
            width="30"
            height="9"
            rx="2"
            fill="var(--paper)"
            stroke="var(--blue)"
            strokeWidth="3"
          />
          <rect
            x="147"
            y="96"
            width="29"
            height="9"
            rx="2"
            fill="var(--coral)"
            stroke="var(--blue)"
            strokeWidth="3"
          />
        </>
      ) : null}
    </g>
  )
}

function OpenBook({ large = false }: { large?: boolean }) {
  return (
    <g aria-hidden="true">
      <path
        d={large ? 'M45 126 Q73 116 105 127 V165 Q75 153 48 161 Z' : 'M54 135 Q77 126 102 136 V165 Q78 155 57 161 Z'}
        fill="var(--paper)"
        stroke="var(--blue)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={large ? 'M105 127 Q138 116 165 126 L161 161 Q134 153 105 165 Z' : 'M102 136 Q126 126 149 135 L146 161 Q125 155 102 165 Z'}
        fill="var(--paper)"
        stroke="var(--blue)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M105 130 V164" stroke="var(--aqua)" strokeWidth="3" />
      <path d="M61 142 L94 136" stroke="var(--stone)" strokeWidth="3" />
      <path d="M62 150 L93 144" stroke="var(--stone)" strokeWidth="3" />
      <path d="M117 137 L151 142" stroke="var(--stone)" strokeWidth="3" />
      <path d="M117 145 L150 150" stroke="var(--stone)" strokeWidth="3" />
    </g>
  )
}

function NotesProp() {
  return (
    <g aria-hidden="true">
      <path
        d="M63 133 L124 124 L132 161 L70 169 Z"
        fill="var(--paper)"
        stroke="var(--blue)"
        strokeWidth="4"
      />
      <path d="M77 141 L116 135" stroke="var(--stone)" strokeWidth="3" />
      <path d="M79 149 L119 143" stroke="var(--stone)" strokeWidth="3" />
      <path d="M81 157 L111 152" stroke="var(--aqua)" strokeWidth="3" />
      <path
        d="M127 116 L142 151"
        stroke="var(--coral)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M142 151 L138 158"
        stroke="var(--blue)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  )
}

function ActivityProp({ workBucket }: { workBucket: WorkBucket }) {
  if (workBucket === 'zero') {
    return (
      <g aria-hidden="true">
        <rect
          x="69"
          y="148"
          width="78"
          height="17"
          rx="5"
          fill="var(--sky)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <rect x="79" y="153" width="57" height="4" rx="2" fill="var(--paper)" />
      </g>
    )
  }

  if (workBucket === 'under-4') return <NotesProp />
  if (workBucket === '4-6') return <OpenBook large />
  if (workBucket === '6-8') return <Laptop />

  if (workBucket === '8-10') {
    return (
      <>
        <BookStack />
        <Laptop />
      </>
    )
  }

  return (
    <>
      <BookStack />
      <Laptop crowded />
      <g aria-hidden="true">
        <path
          d="M35 91 L61 84 L68 105 L43 112 Z"
          fill="var(--paper)"
          stroke="var(--blue)"
          strokeWidth="3"
        />
        <path
          d="M151 80 L178 87 L171 108 L145 100 Z"
          fill="var(--paper)"
          stroke="var(--blue)"
          strokeWidth="3"
        />
        <rect x="42" y="96" width="17" height="3" fill="var(--aqua)" />
        <rect x="153" y="91" width="16" height="3" fill="var(--coral)" />
      </g>
    </>
  )
}

function SpecialProp({ mode }: { mode: PenguinMode }) {
  if (mode === 'winter-holiday') {
    return (
      <g aria-hidden="true">
        <path
          d="M55 38 Q79 13 112 29 L126 43 Q92 34 55 48 Z"
          fill="var(--sky)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <rect
          x="53"
          y="43"
          width="76"
          height="12"
          rx="6"
          fill="var(--coral)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <rect x="77" y="119" width="65" height="13" rx="6" fill="var(--aqua)" />
        <path
          d="M131 124 Q151 141 140 159"
          fill="none"
          stroke="var(--aqua)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <rect x="31" y="79" width="5" height="5" fill="var(--sky)" />
        <rect x="173" y="72" width="6" height="6" fill="var(--sky)" />
        <rect x="43" y="106" width="4" height="4" fill="var(--sky)" />
      </g>
    )
  }

  if (mode === 'summer-holiday') {
    return (
      <g aria-hidden="true">
        <circle cx="174" cy="41" r="14" fill="var(--coral)" opacity="0.9" />
        <path
          d="M52 61 H91"
          stroke="var(--blue-dark)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M111 61 H150"
          stroke="var(--blue-dark)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path d="M92 61 H110" stroke="var(--blue-dark)" strokeWidth="5" />
        <path
          d="M62 143 H150 L141 164 H70 Z"
          fill="var(--sky)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <path
          d="M153 118 L168 159"
          stroke="var(--aqua)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect
          x="145"
          y="145"
          width="27"
          height="25"
          rx="8"
          fill="var(--paper)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <rect x="151" y="149" width="15" height="8" rx="3" fill="var(--coral)" />
      </g>
    )
  }

  if (mode === 'trip') {
    return (
      <g aria-hidden="true">
        <rect
          x="137"
          y="127"
          width="44"
          height="49"
          rx="8"
          fill="var(--aqua)"
          stroke="var(--blue)"
          strokeWidth="5"
        />
        <path
          d="M148 128 V117 H170 V128"
          fill="none"
          stroke="var(--blue)"
          strokeWidth="5"
        />
        <rect x="152" y="144" width="14" height="5" rx="2" fill="var(--paper)" />
        <path
          d="M45 135 L85 125 L91 149 L51 158 Z"
          fill="var(--paper)"
          stroke="var(--blue)"
          strokeWidth="4"
        />
        <path d="M58 141 L78 136" stroke="var(--coral)" strokeWidth="3" />
      </g>
    )
  }

  if (mode === 'sick') {
    return (
      <g aria-hidden="true">
        <path
          d="M45 130 Q105 111 165 131 V172 H48 Z"
          fill="var(--sky)"
          stroke="var(--blue)"
          strokeWidth="5"
        />
        <path
          d="M51 143 Q105 128 159 143"
          fill="none"
          stroke="var(--aqua)"
          strokeWidth="4"
        />
        <path
          d="M147 91 L158 126"
          stroke="var(--blue)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect
          x="150"
          y="84"
          width="10"
          height="33"
          rx="5"
          fill="var(--paper)"
          stroke="var(--blue)"
          strokeWidth="3"
        />
        <rect x="153" y="101" width="4" height="12" rx="2" fill="var(--coral)" />
      </g>
    )
  }

  return null
}

function PrayingPose() {
  return (
    <g aria-hidden="true">
      <path
        d="M60 124 Q76 106 94 117 L103 141 Q81 140 64 151 Z"
        fill="var(--blue-dark)"
        stroke="var(--blue)"
        strokeWidth="4"
      />
      <path
        d="M145 124 Q129 106 111 117 L102 141 Q124 140 141 151 Z"
        fill="var(--blue-dark)"
        stroke="var(--blue)"
        strokeWidth="4"
      />
      <path
        d="M93 116 Q102 106 111 116 L109 145 H96 Z"
        fill="var(--paper)"
        stroke="var(--blue)"
        strokeWidth="3"
      />
      <path
        d="M45 173 H163"
        stroke="var(--coral)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M57 166 H151"
        stroke="var(--aqua)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  )
}

export default function PenguinSprite({
  mode,
  workBucket,
  coffeeBucket,
  label,
  large = false,
}: Props) {
  const praying = mode === 'sunday'
  const upcoming = mode === 'upcoming'
  const special =
    mode !== 'activity' && mode !== 'sunday' && mode !== 'upcoming'
  const coffeeCount = coffeeLevel[coffeeBucket]
  const highCoffee = coffeeCount >= 3

  return (
    <svg
      className={`penguin-sprite${large ? ' penguin-sprite-large' : ''}`}
      viewBox="0 0 220 200"
      role="img"
      aria-label={label}
      shapeRendering="geometricPrecision"
    >
      <g opacity={upcoming ? 0.32 : 1}>
        <ellipse cx="105" cy="181" rx="72" ry="9" fill="var(--blue-wash)" />
        <PixelSparkles intense={highCoffee || workBucket === '10-plus'} />

        <path
          d="M53 106 Q35 126 28 154 Q43 151 59 143 Z"
          fill="var(--blue)"
          stroke="var(--blue-dark)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M157 109 Q181 125 190 153 Q171 151 156 141 Z"
          fill="var(--blue)"
          stroke="var(--blue-dark)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        <ellipse
          cx="105"
          cy="103"
          rx="65"
          ry="76"
          fill="var(--blue)"
          stroke="var(--blue-dark)"
          strokeWidth="7"
        />
        <path
          d="M63 77 Q70 42 103 37 Q137 40 150 77 Q128 69 106 82 Q86 68 63 77 Z"
          fill="var(--blue-dark)"
        />
        <ellipse cx="105" cy="116" rx="47" ry="55" fill="var(--paper)" />
        <ellipse cx="105" cy="136" rx="39" ry="36" fill="var(--sky)" opacity="0.72" />

        <ellipse cx="78" cy="76" rx="28" ry="27" fill="var(--paper)" />
        <ellipse cx="132" cy="76" rx="28" ry="27" fill="var(--paper)" />

        <rect
          x="48"
          y="51"
          width="58"
          height="49"
          rx="15"
          fill="none"
          stroke="var(--blue-dark)"
          strokeWidth="8"
        />
        <rect
          x="105"
          y="51"
          width="58"
          height="49"
          rx="15"
          fill="none"
          stroke="var(--blue-dark)"
          strokeWidth="8"
        />
        <path
          d="M106 66 H105"
          stroke="var(--blue-dark)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M48 68 L31 75"
          stroke="var(--aqua)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M163 68 L178 74"
          stroke="var(--aqua)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {praying ? (
          <>
            <path
              d="M66 77 Q77 82 88 77"
              fill="none"
              stroke="var(--blue-dark)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M121 77 Q132 82 143 77"
              fill="none"
              stroke="var(--blue-dark)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <ellipse
              cx="79"
              cy="76"
              rx={highCoffee ? 9 : 8}
              ry={highCoffee ? 12 : 10}
              fill="var(--blue-dark)"
            />
            <ellipse
              cx="132"
              cy="76"
              rx={highCoffee ? 9 : 8}
              ry={highCoffee ? 12 : 10}
              fill="var(--blue-dark)"
            />
            <circle cx="76" cy="72" r="3" fill="var(--paper)" />
            <circle cx="129" cy="72" r="3" fill="var(--paper)" />
          </>
        )}

        <ellipse cx="62" cy="97" rx="9" ry="5" fill="var(--coral)" opacity="0.78" />
        <ellipse cx="148" cy="97" rx="9" ry="5" fill="var(--coral)" opacity="0.78" />

        <path
          d="M91 96 L105 85 L120 96 L105 108 Z"
          fill="var(--coral)"
          stroke="var(--blue-dark)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M96 99 Q105 108 115 99"
          fill="none"
          stroke="var(--paper)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <rect x="65" y="171" width="29" height="11" rx="5" fill="var(--coral)" />
        <rect x="116" y="171" width="29" height="11" rx="5" fill="var(--coral)" />

        {praying ? (
          <PrayingPose />
        ) : (
          <>
            {!special ? <ActivityProp workBucket={workBucket} /> : null}
            <SpecialProp mode={mode} />
            {!special ? <CoffeeCups count={coffeeCount} /> : null}
          </>
        )}
      </g>

      {upcoming ? (
        <g aria-hidden="true">
          <rect
            x="83"
            y="116"
            width="45"
            height="34"
            rx="6"
            fill="var(--paper)"
            stroke="var(--ash)"
            strokeWidth="4"
          />
          <rect x="83" y="116" width="45" height="9" rx="4" fill="var(--ash)" />
          <rect x="93" y="133" width="25" height="4" rx="2" fill="var(--stone)" />
          <rect x="101" y="141" width="9" height="4" rx="2" fill="var(--stone)" />
        </g>
      ) : null}
    </svg>
  )
}

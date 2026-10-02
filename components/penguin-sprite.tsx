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

function Sparkles({ intense }: { intense: boolean }) {
  return (
    <g aria-hidden="true" opacity={intense ? 1 : 0.7}>
      <path
        d="M38 42 L42 50 L50 54 L42 58 L38 66 L34 58 L26 54 L34 50 Z"
        fill="var(--aqua)"
      />
      {intense ? (
        <path
          d="M194 38 L198 46 L206 50 L198 54 L194 62 L190 54 L182 50 L190 46 Z"
          fill="var(--coral)"
        />
      ) : null}
    </g>
  )
}

function CoffeeCups({ count }: { count: number }) {
  if (count === 0) return null

  const positions = [
    { x: 174, y: 128 },
    { x: 181, y: 150 },
    { x: 158, y: 159 },
    { x: 187, y: 174 },
  ]

  return (
    <g aria-hidden="true">
      {positions.slice(0, count).map((position, index) => (
        <g key={index} transform={`translate(${position.x} ${position.y})`}>
          <path
            d="M0 7 Q0 3 4 3 H20 Q24 3 24 7 V16 Q24 20 20 20 H4 Q0 20 0 16 Z"
            fill="var(--paper)"
            stroke="var(--blue-dark)"
            strokeWidth="3.2"
          />
          <path
            d="M24 7 H28 Q35 7 35 13 Q35 19 28 19 H24"
            fill="none"
            stroke="var(--blue-dark)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M5 9 Q12 6 19 9"
            fill="none"
            stroke="var(--coral)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={index % 2 === 0 ? 'M8 0 Q4 -7 10 -12' : 'M14 0 Q20 -7 14 -12'}
            fill="none"
            stroke="var(--aqua)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      ))}
    </g>
  )
}

function BookStack() {
  return (
    <g aria-hidden="true">
      <path
        d="M19 158 Q19 153 24 153 H68 Q73 153 73 158 V168 Q73 173 68 173 H24 Q19 173 19 168 Z"
        fill="var(--sky)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path
        d="M26 142 Q26 137 31 137 H72 Q77 137 77 142 V153 H26 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path
        d="M15 126 Q15 121 20 121 H66 Q71 121 71 126 V138 H15 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path d="M26 130 H58" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 146 H67" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
      <path d="M29 161 H63" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function Laptop({ crowded = false }: { crowded?: boolean }) {
  return (
    <g aria-hidden="true">
      <path
        d="M58 124 Q58 117 65 117 H153 Q160 117 160 124 L155 166 H63 Z"
        fill="var(--blue-dark)"
        stroke="var(--blue-dark)"
        strokeWidth="3"
      />
      <path
        d="M68 127 Q68 123 72 123 H146 Q150 123 150 127 L147 157 H70 Z"
        fill="var(--sky)"
      />
      <ellipse cx="109" cy="141" rx="12" ry="8" fill="var(--paper)" opacity="0.9" />
      <path
        d="M101 141 Q109 133 117 141 Q109 149 101 141 Z"
        fill="var(--aqua)"
      />
      <path
        d="M52 167 H166 Q165 177 154 179 H64 Q53 177 52 167 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      {crowded ? (
        <>
          <path
            d="M151 107 H185 Q189 107 189 111 V119 H151 Z"
            fill="var(--paper)"
            stroke="var(--blue-dark)"
            strokeWidth="3"
          />
          <path
            d="M158 95 H192 Q196 95 196 99 V107 H158 Z"
            fill="var(--coral)"
            stroke="var(--blue-dark)"
            strokeWidth="3"
          />
        </>
      ) : null}
    </g>
  )
}

function OpenBook() {
  return (
    <g aria-hidden="true">
      <path
        d="M44 133 Q77 119 111 131 V171 Q77 156 49 166 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M111 131 Q145 119 178 133 L173 166 Q145 156 111 171 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M111 134 V169" stroke="var(--aqua)" strokeWidth="2.8" />
      <path d="M60 144 Q82 137 98 140" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M61 153 Q82 146 97 149" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M125 140 Q144 137 164 144" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M126 149 Q145 146 162 153" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function NotesProp() {
  return (
    <g aria-hidden="true">
      <path
        d="M63 136 Q62 131 68 130 L132 121 Q138 120 139 126 L145 161 Q146 166 140 167 L77 176 Q71 177 70 171 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path d="M80 140 L125 134" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M82 149 L128 143" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M84 158 L118 153" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M139 115 L156 155"
        stroke="var(--coral)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M156 155 L151 164"
        stroke="var(--blue-dark)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  )
}

function RestingProp() {
  return (
    <g aria-hidden="true">
      <path
        d="M67 151 Q67 145 73 145 H151 Q157 145 157 151 V166 Q157 172 151 172 H73 Q67 172 67 166 Z"
        fill="var(--sky)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path d="M82 153 H142" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
      <path d="M91 161 H133" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function ActivityProp({ workBucket }: { workBucket: WorkBucket }) {
  if (workBucket === 'zero') return <RestingProp />
  if (workBucket === 'under-4') return <NotesProp />
  if (workBucket === '4-6') return <OpenBook />
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
          d="M34 95 Q34 90 39 89 L66 84 L72 106 L44 112 Q39 113 38 108 Z"
          fill="var(--paper)"
          stroke="var(--blue-dark)"
          strokeWidth="3"
        />
        <path
          d="M159 82 Q160 77 165 78 L194 84 L188 107 L158 100 Z"
          fill="var(--paper)"
          stroke="var(--blue-dark)"
          strokeWidth="3"
        />
        <path d="M44 99 L63 95" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
        <path d="M168 92 L185 96" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </>
  )
}

function SpecialProp({ mode }: { mode: PenguinMode }) {
  if (mode === 'winter-holiday') {
    return (
      <g aria-hidden="true">
        <path
          d="M57 47 Q78 16 113 27 Q131 31 143 48 Q107 41 57 56 Z"
          fill="var(--sky)"
          stroke="var(--blue-dark)"
          strokeWidth="3.5"
        />
        <path
          d="M54 50 Q98 40 146 50"
          fill="none"
          stroke="var(--coral)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="145" cy="47" r="7" fill="var(--coral)" />
        <path
          d="M78 132 Q116 123 150 136"
          fill="none"
          stroke="var(--aqua)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="34" cy="80" r="4" fill="var(--sky)" />
        <circle cx="184" cy="75" r="5" fill="var(--sky)" />
        <circle cx="45" cy="111" r="3.5" fill="var(--sky)" />
      </g>
    )
  }

  if (mode === 'summer-holiday') {
    return (
      <g aria-hidden="true">
        <circle cx="185" cy="39" r="15" fill="var(--coral)" opacity="0.9" />
        <path
          d="M58 65 Q76 56 94 64"
          fill="none"
          stroke="var(--blue-dark)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M119 64 Q137 55 155 64"
          fill="none"
          stroke="var(--blue-dark)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path d="M95 65 H117" stroke="var(--blue-dark)" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M61 148 Q106 134 158 147 L149 173 H70 Z"
          fill="var(--sky)"
          stroke="var(--blue-dark)"
          strokeWidth="3.5"
        />
        <path d="M163 122 L178 158" stroke="var(--aqua)" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M156 151 Q156 145 162 145 H181 Q187 145 187 151 V169 Q187 175 181 175 H162 Q156 175 156 169 Z"
          fill="var(--paper)"
          stroke="var(--blue-dark)"
          strokeWidth="3.5"
        />
        <path d="M163 153 Q171 149 180 153" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" />
      </g>
    )
  }

  if (mode === 'trip') {
    return (
      <g aria-hidden="true">
        <path
          d="M145 130 Q145 123 152 123 H185 Q192 123 192 130 V175 Q192 182 185 182 H152 Q145 182 145 175 Z"
          fill="var(--aqua)"
          stroke="var(--blue-dark)"
          strokeWidth="3.8"
        />
        <path
          d="M156 123 V114 Q156 109 161 109 H176 Q181 109 181 114 V123"
          fill="none"
          stroke="var(--blue-dark)"
          strokeWidth="3.8"
        />
        <path d="M159 146 H178" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M43 143 Q43 138 48 137 L87 129 Q92 128 93 133 L97 151 Q98 156 93 157 L53 165 Q48 166 47 161 Z"
          fill="var(--paper)"
          stroke="var(--blue-dark)"
          strokeWidth="3.5"
        />
        <path d="M58 146 L80 141" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" />
      </g>
    )
  }

  if (mode === 'sick') {
    return (
      <g aria-hidden="true">
        <path
          d="M45 142 Q103 116 170 139 V179 H48 Z"
          fill="var(--sky)"
          stroke="var(--blue-dark)"
          strokeWidth="3.8"
        />
        <path
          d="M53 153 Q108 135 163 151"
          fill="none"
          stroke="var(--aqua)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M158 88 V123"
          stroke="var(--blue-dark)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M153 83 Q153 78 158 78 Q163 78 163 83 V113 Q163 119 158 119 Q153 119 153 113 Z"
          fill="var(--paper)"
          stroke="var(--blue-dark)"
          strokeWidth="3"
        />
        <path d="M158 99 V112" stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="158" cy="114" r="5" fill="var(--coral)" />
      </g>
    )
  }

  return null
}

function PrayingPose() {
  return (
    <g aria-hidden="true">
      <path
        d="M61 132 Q73 113 92 116 Q104 118 111 135 Q96 148 72 156 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path
        d="M157 132 Q145 113 126 116 Q114 118 107 135 Q122 148 146 156 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path
        d="M97 123 Q109 111 121 123 L118 151 H100 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3"
      />
      <path d="M53 180 H169" stroke="var(--coral)" strokeWidth="7" strokeLinecap="round" />
      <path d="M65 171 H157" stroke="var(--aqua)" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function Face({ praying, highCoffee }: { praying: boolean; highCoffee: boolean }) {
  return (
    <>
      <ellipse cx="84" cy="82" rx="33" ry="31" fill="var(--paper)" />
      <ellipse cx="137" cy="82" rx="33" ry="31" fill="var(--paper)" />

      <rect
        x="50"
        y="49"
        width="67"
        height="59"
        rx="20"
        fill="none"
        stroke="var(--blue-dark)"
        strokeWidth="7"
      />
      <rect
        x="104"
        y="49"
        width="67"
        height="59"
        rx="20"
        fill="none"
        stroke="var(--blue-dark)"
        strokeWidth="7"
      />
      <path d="M116 68 H105" stroke="var(--blue-dark)" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 70 L34 77" stroke="var(--aqua)" strokeWidth="6" strokeLinecap="round" />
      <path d="M171 70 L187 76" stroke="var(--aqua)" strokeWidth="6" strokeLinecap="round" />

      {praying ? (
        <>
          <path
            d="M69 82 Q84 92 98 82"
            fill="none"
            stroke="var(--blue-dark)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M123 82 Q137 92 152 82"
            fill="none"
            stroke="var(--blue-dark)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse cx="84" cy="82" rx={highCoffee ? 11 : 10} ry={highCoffee ? 15 : 13} fill="var(--blue-dark)" />
          <ellipse cx="137" cy="82" rx={highCoffee ? 11 : 10} ry={highCoffee ? 15 : 13} fill="var(--blue-dark)" />
          <circle cx="80" cy="77" r="4" fill="var(--paper)" />
          <circle cx="133" cy="77" r="4" fill="var(--paper)" />
          <circle cx="88" cy="87" r="2.5" fill="var(--paper)" opacity="0.85" />
          <circle cx="141" cy="87" r="2.5" fill="var(--paper)" opacity="0.85" />
        </>
      )}

      <ellipse cx="61" cy="106" rx="10" ry="6" fill="var(--coral)" opacity="0.68" />
      <ellipse cx="159" cy="106" rx="10" ry="6" fill="var(--coral)" opacity="0.68" />

      <path
        d="M96 104 Q110 92 124 104 Q113 118 110 118 Q107 118 96 104 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M102 106 Q110 113 118 106"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </>
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
      viewBox="0 0 240 220"
      role="img"
      aria-label={label}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id="penguinBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--blue)" />
          <stop offset="100%" stopColor="var(--blue-dark)" />
        </linearGradient>
        <linearGradient id="bellyWash" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--paper)" />
          <stop offset="100%" stopColor="var(--blue-wash)" />
        </linearGradient>
      </defs>

      <g opacity={upcoming ? 0.33 : 1}>
        <ellipse cx="112" cy="198" rx="78" ry="10" fill="var(--blue-wash)" />
        <Sparkles intense={highCoffee || workBucket === '10-plus'} />

        <path
          d="M54 119 Q29 139 30 169 Q49 163 66 149 Z"
          fill="var(--blue)"
          stroke="var(--blue-dark)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M166 119 Q193 137 197 168 Q177 163 159 150 Z"
          fill="var(--blue)"
          stroke="var(--blue-dark)"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        <ellipse
          cx="111"
          cy="111"
          rx="70"
          ry="84"
          fill="url(#penguinBlue)"
          stroke="var(--blue-dark)"
          strokeWidth="5.5"
        />
        <path
          d="M60 84 Q67 42 108 35 Q151 38 164 83 Q137 69 111 88 Q85 69 60 84 Z"
          fill="var(--blue-dark)"
        />
        <ellipse
          cx="111"
          cy="130"
          rx="52"
          ry="59"
          fill="url(#bellyWash)"
        />
        <ellipse
          cx="111"
          cy="153"
          rx="43"
          ry="34"
          fill="var(--sky)"
          opacity="0.55"
        />

        <Face praying={praying} highCoffee={highCoffee} />

        <path
          d="M70 187 Q80 181 94 187 Q94 200 82 202 Q70 199 70 187 Z"
          fill="var(--coral)"
          stroke="var(--blue-dark)"
          strokeWidth="3"
        />
        <path
          d="M128 187 Q139 181 153 187 Q153 200 141 202 Q128 199 128 187 Z"
          fill="var(--coral)"
          stroke="var(--blue-dark)"
          strokeWidth="3"
        />

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
          <path
            d="M84 133 Q84 126 91 126 H132 Q139 126 139 133 V161 Q139 168 132 168 H91 Q84 168 84 161 Z"
            fill="var(--paper)"
            stroke="var(--ash)"
            strokeWidth="3.5"
          />
          <path d="M84 139 H139" stroke="var(--ash)" strokeWidth="7" />
          <circle cx="101" cy="150" r="3" fill="var(--stone)" />
          <circle cx="112" cy="150" r="3" fill="var(--stone)" />
          <circle cx="123" cy="150" r="3" fill="var(--stone)" />
        </g>
      ) : null}
    </svg>
  )
}

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
  'under-4': 1,
  '4-6': 2,
  '6-8': 3,
  '8-10': 4,
  '10-plus': 5,
}

const workStress: Record<WorkBucket, number> = {
  zero: 0,
  'under-4': 1,
  '4-6': 2,
  '6-8': 3,
  '8-10': 4,
  '10-plus': 5,
}

const coffeeStress: Record<CoffeeBucket, number> = {
  zero: 0,
  'under-4': 1,
  '4-6': 2,
  '6-8': 3,
  '8-10': 4,
  '10-plus': 5,
}

function Sparkles({ intense }: { intense: boolean }) {
  return (
    <g aria-hidden="true" opacity={intense ? 1 : 0.68}>
      <path
        d="M33 52 L38 61 L47 66 L38 71 L33 80 L28 71 L19 66 L28 61 Z"
        fill="var(--aqua)"
      />
      {intense ? (
        <path
          d="M219 47 L224 56 L233 61 L224 66 L219 75 L214 66 L205 61 L214 56 Z"
          fill="var(--coral)"
        />
      ) : null}
    </g>
  )
}

function CoffeeMug({
  x,
  y,
  scale = 1,
}: {
  x: number
  y: number
  scale?: number
}) {
  return (
    <g
      aria-hidden="true"
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <ellipse
        cx="16"
        cy="30"
        rx="18"
        ry="4"
        fill="var(--stone)"
        opacity="0.55"
      />
      <path
        d="M1 7 Q1 2 6 2 H27 Q32 2 32 7 V21 Q32 27 26 27 H7 Q1 27 1 21 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path
        d="M32 8 H37 Q45 8 45 15 Q45 22 37 22 H32"
        fill="none"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <ellipse
        cx="16.5"
        cy="8"
        rx="11"
        ry="4.5"
        fill="var(--coral)"
      />
      <path
        d="M11 -1 Q5 -8 11 -15"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M21 -1 Q27 -8 21 -15"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </g>
  )
}

function CoffeeCups({ count }: { count: number }) {
  if (count === 0) return null

  const positions = [
    { x: 184, y: 121, scale: 0.84 },
    { x: 198, y: 151, scale: 0.78 },
    { x: 170, y: 166, scale: 0.78 },
    { x: 205, y: 184, scale: 0.72 },
    { x: 178, y: 199, scale: 0.67 },
  ]

  return (
    <g aria-hidden="true">
      {positions.slice(0, count).map((position, index) => (
        <CoffeeMug
          key={index}
          x={position.x}
          y={position.y}
          scale={position.scale}
        />
      ))}
    </g>
  )
}

function BookStack() {
  return (
    <g aria-hidden="true">
      <path
        d="M16 164 Q16 158 22 158 H70 Q76 158 76 164 V173 Q76 179 70 179 H22 Q16 179 16 173 Z"
        fill="var(--sky)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path
        d="M25 148 Q25 142 31 142 H73 Q79 142 79 148 V158 H25 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path
        d="M13 132 Q13 126 19 126 H66 Q72 126 72 132 V142 H13 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path d="M24 134 H58" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 150 H68" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 166 H65" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function Laptop({ crowded = false }: { crowded?: boolean }) {
  return (
    <g aria-hidden="true">
      <path
        d="M61 132 Q61 124 69 124 H158 Q166 124 166 132 L161 174 H66 Z"
        fill="var(--blue-dark)"
      />
      <path
        d="M72 135 Q72 131 76 131 H151 Q155 131 155 135 L152 165 H75 Z"
        fill="var(--sky)"
      />
      <ellipse cx="114" cy="149" rx="13" ry="9" fill="var(--paper)" />
      <path
        d="M104 149 Q114 139 124 149 Q114 159 104 149 Z"
        fill="var(--aqua)"
      />
      <path
        d="M54 175 H173 Q171 186 160 188 H67 Q56 186 54 175 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      {crowded ? (
        <>
          <path
            d="M155 113 H190 Q195 113 195 118 V125 H155 Z"
            fill="var(--paper)"
            stroke="var(--blue-dark)"
            strokeWidth="3"
          />
          <path
            d="M163 101 H198 Q203 101 203 106 V113 H163 Z"
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
        d="M45 142 Q80 125 115 139 V180 Q80 163 50 174 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M115 139 Q150 125 185 142 L180 174 Q149 163 115 180 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M115 142 V178" stroke="var(--aqua)" strokeWidth="2.8" />
      <path d="M61 151 Q85 143 101 147" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 160 Q85 152 100 156" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M130 147 Q150 143 171 151" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M131 156 Q151 152 169 160" fill="none" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function NotesProp() {
  return (
    <g aria-hidden="true">
      <path
        d="M66 143 Q65 137 71 136 L136 127 Q142 126 143 132 L149 168 Q150 174 144 175 L80 184 Q74 185 73 179 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path d="M83 148 L129 142" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 157 L132 151" stroke="var(--stone)" strokeWidth="3" strokeLinecap="round" />
      <path d="M87 166 L121 161" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M143 121 L160 162"
        stroke="var(--coral)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M160 162 L155 171"
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
        d="M69 158 Q69 151 76 151 H156 Q163 151 163 158 V174 Q163 181 156 181 H76 Q69 181 69 174 Z"
        fill="var(--sky)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path d="M85 160 H147" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
      <path d="M95 169 H137" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function MeasuringTape() {
  return (
    <g aria-hidden="true">
      <path
        d="M55 140 Q105 172 171 137"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M57 140 Q105 166 169 137"
        fill="none"
        stroke="#ffd166"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {[66, 79, 92, 105, 118, 131, 144, 157].map((x, index) => (
        <path
          key={x}
          d={`M${x} ${148 + (index % 2) * 3} L${x + 2} ${137 + (index % 2) * 2}`}
          stroke="var(--blue-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </g>
  )
}

function StressCues({ level }: { level: number }) {
  if (level < 5) return null

  return (
    <g aria-hidden="true">
      <path
        d="M190 72 Q204 84 194 98"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M200 87 Q210 100 201 112"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      {level >= 7 ? (
        <>
          <path
            d="M36 104 Q30 94 35 85"
            fill="none"
            stroke="var(--coral)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M42 96 Q39 87 44 79"
            fill="none"
            stroke="var(--coral)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.78"
          />
          <path
            d="M203 117 Q213 111 223 118"
            fill="none"
            stroke="var(--blue-dark)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {level >= 9 ? (
        <>
          <path
            d="M29 132 L54 125 L58 143 L33 150 Z"
            fill="var(--paper)"
            stroke="var(--blue-dark)"
            strokeWidth="2.7"
          />
          <path
            d="M200 130 L226 138 L220 156 L194 148 Z"
            fill="var(--paper)"
            stroke="var(--blue-dark)"
            strokeWidth="2.7"
          />
        </>
      ) : null}
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
        <MeasuringTape />
        <Laptop />
      </>
    )
  }

  return (
    <>
      <BookStack />
      <MeasuringTape />
      <Laptop crowded />
      <g aria-hidden="true">
        <path
          d="M36 102 Q36 96 42 95 L70 90 L76 112 L47 118 Q41 119 40 113 Z"
          fill="var(--paper)"
          stroke="var(--blue-dark)"
          strokeWidth="3"
        />
        <path
          d="M168 88 Q169 82 175 83 L204 89 L198 113 L168 106 Z"
          fill="var(--paper)"
          stroke="var(--blue-dark)"
          strokeWidth="3"
        />
        <path d="M47 105 L66 101" stroke="var(--aqua)" strokeWidth="3" strokeLinecap="round" />
        <path d="M177 98 L194 102" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M184 64 Q195 76 186 88"
          fill="none"
          stroke="var(--aqua)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </>
  )
}

function SundayScene() {
  return (
    <g aria-hidden="true">
      <path
        d="M77 143 Q89 121 107 125 Q119 128 126 144 Q110 159 87 166 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path
        d="M162 143 Q150 121 132 125 Q120 128 113 144 Q129 159 152 166 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path
        d="M105 130 Q117 117 129 130 L126 158 H108 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3"
      />
      <path
        d="M204 73 V114 M188 88 H220"
        stroke="var(--aqua)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.78"
      />
      <path d="M62 190 H176" stroke="var(--coral)" strokeWidth="7" strokeLinecap="round" />
      <path d="M75 180 H164" stroke="var(--aqua)" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function WinterHolidayScene() {
  return (
    <g aria-hidden="true">
      <path
        d="M61 51 Q83 18 120 29 Q139 33 153 52 Q115 44 61 60 Z"
        fill="var(--sky)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path
        d="M58 54 Q106 43 156 54"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <circle cx="155" cy="51" r="8" fill="var(--coral)" />
      <path
        d="M82 140 Q121 128 157 142"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M151 143 Q176 159 164 181"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <g fill="var(--sky)">
        <circle cx="35" cy="87" r="5" />
        <circle cx="207" cy="81" r="6" />
        <circle cx="46" cy="123" r="4" />
        <circle cx="194" cy="126" r="4.5" />
      </g>
      <path
        d="M18 173 H62 V205 H18 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M40 173 V205 M18 187 H62" stroke="var(--paper)" strokeWidth="4" />
      <path d="M33 173 Q30 163 40 166 Q50 163 47 173" fill="none" stroke="var(--aqua)" strokeWidth="4" />
    </g>
  )
}

function SummerHolidayScene() {
  return (
    <g aria-hidden="true">
      <circle cx="210" cy="42" r="18" fill="var(--coral)" opacity="0.92" />
      <g stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" opacity="0.8">
        <path d="M210 13 V4" />
        <path d="M210 80 V71" />
        <path d="M181 42 H172" />
        <path d="M248 42 H239" />
      </g>
      <path
        d="M62 70 Q82 59 102 69"
        fill="none"
        stroke="var(--blue-dark)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M124 69 Q144 58 164 69"
        fill="none"
        stroke="var(--blue-dark)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path d="M103 70 H123" stroke="var(--blue-dark)" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M64 158 Q112 141 166 156 L157 185 H73 Z"
        fill="var(--sky)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <circle cx="41" cy="181" r="21" fill="var(--paper)" stroke="var(--blue-dark)" strokeWidth="3.5" />
      <path d="M41 160 A21 21 0 0 1 60 171 L41 181 Z" fill="var(--coral)" />
      <path d="M41 181 L23 193 A21 21 0 0 1 20 171 Z" fill="var(--aqua)" />
      <path d="M41 181 L57 196 A21 21 0 0 1 23 193 Z" fill="var(--sky)" />
      <path
        d="M179 145 Q179 139 185 139 H205 Q211 139 211 145 V169 Q211 175 205 175 H185 Q179 175 179 169 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path d="M185 148 Q195 143 205 148" stroke="var(--coral)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M203 130 L194 144" stroke="var(--aqua)" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function TripScene() {
  return (
    <g aria-hidden="true">
      <path
        d="M184 58 Q209 46 232 55"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="6 7"
      />
      <path
        d="M218 45 L237 55 L219 65 L222 57 L208 55 L222 53 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M151 139 Q151 131 159 131 H196 Q204 131 204 139 V189 Q204 197 196 197 H159 Q151 197 151 189 Z"
        fill="var(--aqua)"
        stroke="var(--blue-dark)"
        strokeWidth="3.8"
      />
      <path
        d="M163 131 V120 Q163 114 169 114 H186 Q192 114 192 120 V131"
        fill="none"
        stroke="var(--blue-dark)"
        strokeWidth="3.8"
      />
      <path d="M166 156 H188" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M38 153 Q38 147 44 146 L89 137 Q95 136 96 142 L101 162 Q102 168 96 169 L51 178 Q45 179 44 173 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path d="M54 156 L80 151" stroke="var(--coral)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M58 164 L83 159" stroke="var(--sky)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function SickScene() {
  return (
    <g aria-hidden="true">
      <path
        d="M43 151 Q108 121 181 148 V195 H46 Z"
        fill="var(--sky)"
        stroke="var(--blue-dark)"
        strokeWidth="3.8"
      />
      <path
        d="M52 164 Q113 143 173 161"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M174 91 Q174 84 181 84 Q188 84 188 91 V124 Q188 131 181 131 Q174 131 174 124 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
      <path d="M181 106 V123" stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="181" cy="127" r="6" fill="var(--coral)" />
      <path
        d="M22 166 Q22 160 28 160 H60 Q66 160 66 166 V188 H22 Z"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3.5"
      />
      <path
        d="M37 160 Q35 145 46 146 Q57 145 55 160"
        fill="var(--paper)"
        stroke="var(--blue-dark)"
        strokeWidth="3"
      />
      <path d="M29 173 H58" stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M78 41 Q111 27 144 41 L136 55 Q111 47 86 55 Z"
        fill="var(--aqua)"
        stroke="var(--blue-dark)"
        strokeWidth="3.2"
      />
    </g>
  )
}

function SpecialScene({ mode }: { mode: PenguinMode }) {
  if (mode === 'sunday') return <SundayScene />
  if (mode === 'winter-holiday') return <WinterHolidayScene />
  if (mode === 'summer-holiday') return <SummerHolidayScene />
  if (mode === 'trip') return <TripScene />
  if (mode === 'sick') return <SickScene />
  return null
}

function BasePenguinShell() {
  return (
    <g aria-hidden="true">
      <ellipse cx="130" cy="215" rx="90" ry="8" fill="var(--blue-wash)" />

      <path
        d="M47 154 Q29 168 19 166 Q29 183 55 181"
        fill="var(--blue-dark)"
        stroke="var(--blue-dark)"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      <path
        d="M130 17
           C86 15 55 38 50 80
           C45 121 51 168 75 196
           C88 211 106 219 130 219
           C154 219 172 211 185 196
           C209 168 215 121 210 80
           C205 38 174 15 130 17 Z"
        fill="url(#mascot-shell)"
        stroke="var(--blue-dark)"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      <path
        d="M61 82
           Q68 45 105 29
           Q133 18 163 28
           Q188 37 199 62
           Q177 47 150 44
           Q113 39 82 57
           Q68 65 61 82 Z"
        fill="var(--blue-dark)"
        opacity="0.9"
      />

      <path
        d="M72 55 Q103 28 147 30 Q172 31 190 46"
        fill="none"
        stroke="var(--sky)"
        strokeWidth="13"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M81 44 Q103 29 126 29"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.95"
      />
      <ellipse cx="149" cy="31" rx="7.5" ry="4.2" fill="var(--paper)" opacity="0.95" />
      <ellipse cx="167" cy="37" rx="4.8" ry="2.9" fill="var(--paper)" opacity="0.88" />

      <path
        d="M63 93
           Q65 59 91 49
           Q112 40 129 68
           Q146 40 168 49
           Q195 59 197 94
           Q178 80 158 80
           Q143 80 130 95
           Q117 80 101 80
           Q82 80 63 93 Z"
        fill="var(--paper)"
      />

      <path
        d="M76 118
           Q97 99 130 99
           Q163 99 184 119
           Q193 154 179 185
           Q163 207 130 210
           Q97 207 81 185
           Q67 154 76 118 Z"
        fill="var(--paper)"
      />

      <path
        d="M88 145
           Q105 126 130 126
           Q155 126 172 145
           Q173 177 158 197
           Q145 205 130 205
           Q115 205 102 197
           Q87 177 88 145 Z"
        fill="url(#mascot-belly)"
      />

      <path
        d="M67 116
           Q42 128 35 158
           Q58 156 87 137
           L90 120
           Q79 113 67 116 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M193 116
           Q218 128 225 158
           Q202 156 173 137
           L170 120
           Q181 113 193 116 Z"
        fill="var(--blue)"
        stroke="var(--blue-dark)"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      <path
        d="M43 145 Q61 151 81 137"
        fill="none"
        stroke="var(--aqua)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M179 137 Q199 150 217 145"
        fill="none"
        stroke="var(--sky)"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      <path
        d="M86 197 Q101 187 116 198 Q116 213 102 220 Q88 216 86 197 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="4.2"
      />
      <path
        d="M144 198 Q159 187 174 198 Q174 213 160 220 Q146 216 144 198 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="4.2"
      />
      <path d="M94 199 L101 215 L108 198" fill="var(--paper)" opacity="0.48" />
      <path d="M152 199 L159 215 L166 198" fill="var(--paper)" opacity="0.48" />
    </g>
  )
}

function Face({
  eyesClosed,
  stressLevel,
}: {
  eyesClosed: boolean
  stressLevel: number
}) {
  const stressed = stressLevel >= 6
  const highlyStressed = stressLevel >= 9

  return (
    <>
      <rect
        x="56"
        y="65"
        width="70"
        height="58"
        rx="18"
        fill="rgba(255,255,255,0.02)"
        stroke="var(--blue-dark)"
        strokeWidth="10"
      />
      <rect
        x="134"
        y="65"
        width="70"
        height="58"
        rx="18"
        fill="rgba(255,255,255,0.02)"
        stroke="var(--blue-dark)"
        strokeWidth="10"
      />
      <path d="M126 80 H134" stroke="var(--blue-dark)" strokeWidth="10" strokeLinecap="round" />
      <path d="M56 83 L34 92" stroke="var(--aqua)" strokeWidth="8" strokeLinecap="round" />
      <path d="M204 83 L226 91" stroke="var(--aqua)" strokeWidth="8" strokeLinecap="round" />

      <path
        d="M66 72 Q92 63 116 70"
        fill="none"
        stroke="var(--sky)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.92"
      />
      <path
        d="M144 70 Q168 63 194 72"
        fill="none"
        stroke="var(--sky)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.92"
      />

      {eyesClosed ? (
        <>
          <path
            d="M77 94 Q92 104 108 94"
            fill="none"
            stroke="var(--blue-dark)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d="M152 94 Q168 104 183 94"
            fill="none"
            stroke="var(--blue-dark)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse
            cx="92"
            cy="94"
            rx={stressed ? 16 : 14}
            ry={stressed ? 20 : 18}
            fill="var(--blue-dark)"
          />
          <ellipse
            cx="168"
            cy="94"
            rx={stressed ? 16 : 14}
            ry={stressed ? 20 : 18}
            fill="var(--blue-dark)"
          />
          <circle cx="86" cy="86" r="5.6" fill="var(--paper)" />
          <circle cx="162" cy="86" r="5.6" fill="var(--paper)" />
          <circle cx="98" cy="102" r="3.6" fill="var(--paper)" opacity="0.92" />
          <circle cx="174" cy="102" r="3.6" fill="var(--paper)" opacity="0.92" />
        </>
      )}

      {highlyStressed ? (
        <>
          <path d="M74 70 Q91 60 109 68" fill="none" stroke="var(--coral)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M151 68 Q169 60 186 70" fill="none" stroke="var(--coral)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M210 101 Q221 110 212 122 Q202 115 210 101 Z" fill="var(--aqua)" opacity="0.92" />
        </>
      ) : null}

      <ellipse cx="68" cy="127" rx="12.5" ry="6.7" fill="var(--coral)" opacity={stressed ? 0.92 : 0.8} />
      <ellipse cx="192" cy="127" rx="12.5" ry="6.7" fill="var(--coral)" opacity={stressed ? 0.92 : 0.8} />

      <path
        d="M112 118 Q130 102 148 118 L130 131 Z"
        fill="var(--coral)"
        stroke="var(--blue-dark)"
        strokeWidth="3.7"
        strokeLinejoin="round"
      />
      <path
        d="M114 130
           Q130 147 146 130
           Q143 150 130 154
           Q117 150 114 130 Z"
        fill="var(--blue-dark)"
        stroke="var(--blue-dark)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M121 143 Q130 149 139 143" fill="none" stroke="var(--coral)" strokeWidth="4.8" strokeLinecap="round" />
      <path d="M119 118 Q130 110 141 118" fill="none" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" opacity="0.74" />
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
  const upcoming = mode === 'upcoming'
  const special =
    mode !== 'activity' && mode !== 'upcoming'
  const coffeeCount = coffeeLevel[coffeeBucket]
  const stressLevel = workStress[workBucket] + coffeeStress[coffeeBucket]
  const highCoffee = coffeeCount >= 3
  const eyesClosed = mode === 'sunday' || mode === 'sick'

  return (
    <svg
      className={`penguin-sprite${large ? ' penguin-sprite-large' : ''}`}
      viewBox="0 0 260 230"
      role="img"
      aria-label={label}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id="mascot-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--blue)" />
          <stop offset="58%" stopColor="var(--blue)" />
          <stop offset="100%" stopColor="var(--blue-dark)" />
        </linearGradient>
        <linearGradient id="mascot-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--paper)" />
          <stop offset="58%" stopColor="var(--sky)" />
          <stop offset="100%" stopColor="var(--aqua)" />
        </linearGradient>
      </defs>
      <g opacity={upcoming ? 0.33 : 1}>
        <BasePenguinShell />

        {!special ? (
          <Sparkles intense={highCoffee || workBucket === '10-plus'} />
        ) : null}

        <Face eyesClosed={eyesClosed} stressLevel={special ? 0 : stressLevel} />

        {special ? (
          <SpecialScene mode={mode} />
        ) : (
          <>
            <ActivityProp workBucket={workBucket} />
            <CoffeeCups count={coffeeCount} />
            <StressCues level={stressLevel} />
          </>
        )}
      </g>

      {upcoming ? (
        <g aria-hidden="true">
          <path
            d="M91 143 Q91 136 98 136 H141 Q148 136 148 143 V172 Q148 179 141 179 H98 Q91 179 91 172 Z"
            fill="var(--paper)"
            stroke="var(--ash)"
            strokeWidth="3.5"
          />
          <path d="M91 149 H148" stroke="var(--ash)" strokeWidth="7" />
          <circle cx="108" cy="160" r="3" fill="var(--stone)" />
          <circle cx="120" cy="160" r="3" fill="var(--stone)" />
          <circle cx="132" cy="160" r="3" fill="var(--stone)" />
        </g>
      ) : null}
    </svg>
  )
}

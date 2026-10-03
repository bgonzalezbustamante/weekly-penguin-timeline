import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const PENGUIN_DIR = path.join(ROOT, 'public', 'penguins')
const STATE_DIR = path.join(PENGUIN_DIR, 'states')
const WEBP_DIR = path.join(STATE_DIR, 'webp')
const CANONICAL_PNG = path.join(PENGUIN_DIR, 'canonical-baseline.png')
const CANONICAL_WEBP = path.join(PENGUIN_DIR, 'canonical-baseline.webp')

const WORK_BUCKETS = [
  'zero',
  'under-4',
  '4-6',
  '6-8',
  '8-10',
  '10-plus',
]

const COFFEE_BUCKETS = [
  'zero',
  'under-4',
  '4-6',
  '6-8',
  '8-10',
  '10-plus',
]

const SPECIAL_STATES = [
  'sunday',
  'winter-holiday',
  'summer-holiday',
  'trip',
  'conference',
  'sick',
]

const NORMAL_STATE_FILES = WORK_BUCKETS.flatMap((workBucket) =>
  COFFEE_BUCKETS.map(
    (coffeeBucket) =>
      `work-${workBucket}__coffee-${coffeeBucket}.png`
  )
)

const SPECIAL_STATE_FILES = SPECIAL_STATES.map((state) => `${state}.png`)
const CONTEXT_STATE_FILES = [
  'working-day.png',
  'canonical-couple.png',
  'teaching.png',
]
const REQUIRED_STATE_FILES = [
  ...NORMAL_STATE_FILES,
  ...SPECIAL_STATE_FILES,
  ...CONTEXT_STATE_FILES,
]

const shouldGenerate = process.argv.includes('--generate')
const force = process.argv.includes('--force')

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`
  return `${(bytes / 1024 ** 2).toFixed(2)} MiB`
}

function inspectPng(buffer, fileLabel) {
  const signature = '89504e470d0a1a0a'
  if (buffer.length < 33 || buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error(`${fileLabel} is not a valid PNG file.`)
  }

  if (buffer.subarray(12, 16).toString('ascii') !== 'IHDR') {
    throw new Error(`${fileLabel} does not contain a valid PNG IHDR chunk.`)
  }

  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  const bitDepth = buffer[24]
  const colourType = buffer[25]
  const hasAlpha =
    colourType === 4 ||
    colourType === 6 ||
    buffer.includes(Buffer.from('tRNS', 'ascii'))

  if (width < 512 || height < 512) {
    throw new Error(
      `${fileLabel} is too small (${width}×${height}); minimum dimensions are 512×512.`
    )
  }

  return {
    width,
    height,
    bitDepth,
    colourType,
    hasAlpha,
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function validatePng(filePath, fileLabel) {
  const [buffer, stats] = await Promise.all([
    fs.readFile(filePath),
    fs.stat(filePath),
  ])

  if (stats.size === 0) {
    throw new Error(`${fileLabel} is empty.`)
  }

  return {
    ...inspectPng(buffer, fileLabel),
    bytes: stats.size,
    mtimeMs: stats.mtimeMs,
  }
}

async function validateAssetSet() {
  const errors = []
  const warnings = []

  if (!(await fileExists(CANONICAL_PNG))) {
    errors.push('Missing public/penguins/canonical-baseline.png')
  }

  const stateEntries = await fs.readdir(STATE_DIR, { withFileTypes: true })
  const actualPngFiles = stateEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.png'))
    .map((entry) => entry.name)
    .sort()

  const actualSet = new Set(actualPngFiles)
  const expectedSet = new Set(REQUIRED_STATE_FILES)

  for (const file of REQUIRED_STATE_FILES) {
    if (!actualSet.has(file)) {
      errors.push(`Missing public/penguins/states/${file}`)
    }
  }

  for (const file of actualPngFiles) {
    if (!expectedSet.has(file)) {
      warnings.push(`Unexpected PNG in state directory: ${file}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  const sourceFiles = [
    {
      source: CANONICAL_PNG,
      label: 'public/penguins/canonical-baseline.png',
      destination: CANONICAL_WEBP,
    },
    ...REQUIRED_STATE_FILES.map((file) => ({
      source: path.join(STATE_DIR, file),
      label: `public/penguins/states/${file}`,
      destination: path.join(WEBP_DIR, file.replace(/\.png$/, '.webp')),
    })),
  ]

  let totalPngBytes = 0
  let transparentCount = 0
  const validated = []

  for (const asset of sourceFiles) {
    const metadata = await validatePng(asset.source, asset.label)
    totalPngBytes += metadata.bytes
    if (metadata.hasAlpha) transparentCount += 1
    else warnings.push(`${asset.label} has no detected alpha channel.`)

    validated.push({
      ...asset,
      metadata,
    })
  }

  return {
    validated,
    warnings,
    totalPngBytes,
    transparentCount,
  }
}

async function generateWebpAssets(validated) {
  const { default: sharp } = await import('sharp')
  await fs.mkdir(WEBP_DIR, { recursive: true })

  let generated = 0
  let skipped = 0
  let totalWebpBytes = 0

  for (const asset of validated) {
    const destinationExists = await fileExists(asset.destination)
    let regenerate = force || !destinationExists

    if (!regenerate && destinationExists) {
      const destinationStats = await fs.stat(asset.destination)
      regenerate = asset.metadata.mtimeMs > destinationStats.mtimeMs
    }

    if (regenerate) {
      await fs.mkdir(path.dirname(asset.destination), { recursive: true })
      await sharp(asset.source)
        .webp({
          quality: 90,
          alphaQuality: 100,
          smartSubsample: true,
          effort: 5,
        })
        .toFile(asset.destination)
      generated += 1
    } else {
      skipped += 1
    }

    const [outputStats, outputMetadata] = await Promise.all([
      fs.stat(asset.destination),
      sharp(asset.destination).metadata(),
    ])

    if (
      outputMetadata.width !== asset.metadata.width ||
      outputMetadata.height !== asset.metadata.height
    ) {
      throw new Error(
        `Generated WebP dimensions do not match source for ${asset.label}.`
      )
    }

    totalWebpBytes += outputStats.size
  }

  return {
    generated,
    skipped,
    totalWebpBytes,
  }
}

async function main() {
  const {
    validated,
    warnings,
    totalPngBytes,
    transparentCount,
  } = await validateAssetSet()

  console.log(
    `Validated ${validated.length} PNG masters: 36 activity states, 6 special states, 1 upcoming working-day state, 1 Saturday couple state, 1 teaching state and 1 canonical baseline.`
  )
  console.log(
    `Detected transparency in ${transparentCount}/${validated.length} PNG masters.`
  )
  console.log(`PNG master size: ${formatBytes(totalPngBytes)}.`)

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`)
  }

  if (!shouldGenerate) {
    return
  }

  const { generated, skipped, totalWebpBytes } =
    await generateWebpAssets(validated)

  const reduction =
    totalPngBytes === 0
      ? 0
      : Math.max(0, (1 - totalWebpBytes / totalPngBytes) * 100)

  console.log(
    `WebP runtime assets: ${generated} generated, ${skipped} already current.`
  )
  console.log(
    `WebP runtime size: ${formatBytes(totalWebpBytes)} (${reduction.toFixed(1)}% smaller than PNG masters).`
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

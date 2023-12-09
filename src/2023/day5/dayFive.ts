import input from './input'

// const input = `
// seeds: 79 14 55 13
//
// seed-to-soil map:
// 50 98 2
// 52 50 48
//
// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15
//
// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4
//
// water-to-light map:
// 88 18 7
// 18 25 70
//
// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13
//
// temperature-to-humidity map:
// 0 69 1
// 1 0 69
//
// humidity-to-location map:
// 60 56 37
// 56 93 4
// `.trim()

const lines = input.split('\n')

const categories = [
  'seed',
  'soil',
  'fertilizer',
  'water',
  'light',
  'temperature',
  'humidity',
  'location'
] as const

type Category = typeof categories[number]

type Range = Readonly<{
  start: number
  end: number
}>

type RangeMapping = Readonly<{
  source: Range
  destination: Range
}>

type CategoryMapping = Readonly<{
  sourceCategory: Category
  destinationCategory: Category
  rangeMappings: readonly RangeMapping[]
}>

const mapDefinitionRegex = /^(\w+)-to-(\w+) map:$/
const rangeRegex = /^(\d+) (\d+) (\d+)$/

const parseRange = (index: number): RangeMapping | undefined => {
  const line = (lines[index] ?? '').trim()
  if (line.length > 0) {
    const values = (rangeRegex.exec(line) ?? []).slice(1, 4).map(Number)
    if (values.length === 3 && values.every(_ => Number.isInteger(_))) {
      const [destinationStart, sourceStart, length] = values
      return {
        source: {
          start: sourceStart,
          end: sourceStart + length
        },
        destination: {
          start: destinationStart,
          end: destinationStart + length
        }
      }
    }
    throw new Error(`Invalid mapping range on line ${index + 1}: ${line}`)
  } else {
    return undefined
  }
}

const parseCategoryMapping = (startIndex: number): CategoryMapping => {
  const [
    sourceCategory,
    destinationCategory
  ] = (mapDefinitionRegex.exec(lines[startIndex]) ?? []).slice(1) as Category[]
  if (categories.includes(sourceCategory) && categories.includes(destinationCategory)) {
    let index = startIndex + 1
    const rangeMappings: RangeMapping[] = []
    while (index < lines.length) {
      const range = parseRange(index)
      if (range) {
        rangeMappings.push(range)
        index++
      } else {
        break
      }
    }
    return { sourceCategory, destinationCategory, rangeMappings }
  } else {
    throw new Error(`Invalid mapping found at line number ${startIndex + 1}: ${lines[startIndex]}`)
  }
}

type MappingsBySource = Record<Category, CategoryMapping>

const parseAllMappings = (): Readonly<MappingsBySource> => {
  let index = 2
  const result: Partial<MappingsBySource> = {}
  while (index < lines.length) {
    const mapping = parseCategoryMapping(index)
    result[mapping.sourceCategory] = mapping
    index += mapping.rangeMappings.length + 2
  }
  if (Object.keys(result).length === categories.length - 1) {
    return result as MappingsBySource
  } else {
    const mappingDesc = (m: CategoryMapping) => `${m.sourceCategory} -> ${m.destinationCategory}`
    throw new Error(`Not all mappings were present: ${Object.values(result).map(mappingDesc).join(', ')}`)
  }
}

const mappingsBySource = parseAllMappings()

type SplitRange = Readonly<{
  match: Range
  remainder: readonly Range[]
}>

const splitRange = (valueRange: Range, mappingRange: Range): SplitRange | undefined => {
  if (valueRange.start <= mappingRange.start) {
    if (valueRange.end > mappingRange.start) {
      const match: Range = { start: mappingRange.start, end: Math.min(mappingRange.end, valueRange.end) }
      const before: Range = { start: valueRange.start, end: mappingRange.start }
      const after: Range = { start: match.end, end: valueRange.end }
      return { match, remainder: [before, after].filter(_ => _.end > _.start) }
    }
  } else if (valueRange.start < mappingRange.end) {
    const match = { start: valueRange.start, end: Math.min(valueRange.end, mappingRange.end) }
    const after = { start: match.end, end: valueRange.end }
    return { match, remainder: after.end > after.start ? [after] : [] }
  } else {
    return undefined
  }
}

const mapToDestination = (sourceRange: Range, rangeMapping: RangeMapping): Range => {
  const start = rangeMapping.destination.start + sourceRange.start - rangeMapping.source.start
  return {
    start,
    end: start + sourceRange.end - sourceRange.start
  }
}

const getDestinationRanges = (category: Category, sourceRanges: readonly Range[]): Range[] => {
  const remainingRanges = [...sourceRanges]
  const mapping: CategoryMapping = mappingsBySource[category]
  const destinationRanges: Range[] = []
  for (let i = 0; i < mapping.rangeMappings.length && remainingRanges.length > 0; i++) {
    const rangeMapping = mapping.rangeMappings[i]
    for (let j = remainingRanges.length - 1; j >= 0; j--) {
      const range = remainingRanges[j]
      const result = splitRange(range, rangeMapping.source)
      if (result) {
        destinationRanges.push(mapToDestination(result.match, rangeMapping))
        remainingRanges.splice(j, 1)
        remainingRanges.push(...result.remainder)
      }
    }
  }
  // any remaining ranges won't match any mappings so they map to themselves
  destinationRanges.push(...remainingRanges)
  return destinationRanges
}

const getLowestLocation = (seedRanges: readonly Range[]): number => {
  let category: Category = 'seed'
  let currentRanges = seedRanges
  while (true) {
    currentRanges = getDestinationRanges(category, currentRanges)
    category = mappingsBySource[category].destinationCategory
    if (category === 'location') {
      let lowest = Number.MAX_SAFE_INTEGER
      currentRanges.forEach(range => {
        if (range.start < lowest) {
          lowest = range.start
        }
      })
      return lowest
    }
  }
}

const seedsRegex = /seeds: (.+)/

const parseSeedValues = (): number[] => {
  const line = lines[0]
  const seedValueString = (seedsRegex.exec(line) ?? [])[1]
  if (seedValueString) {
    const values = seedValueString.split(' ').map(Number)
    if (values.length > 0 && values.every(Number.isInteger)) {
      return values
    }
  }
  throw new Error(`Invalid seed definition: ${line}`)
}

const parseSeedRanges = (): readonly Range[] => {
  const values = parseSeedValues()
  if (values.length % 2 === 0) {
    const ranges: Range[] = []
    for (let i = 0; i < values.length; i += 2) {
      const start = values[i]
      ranges.push({ start, end: start + values[i + 1] })
    }
    return ranges
  } else {
    throw new Error(`Invalid seed ranges: ${lines[0]}`)
  }
}

const partOne = () => {
  const result = getLowestLocation(parseSeedValues().map(start => ({ start, end: start + 1 })))
  console.log(`Part 1: ${result}`)
}

const partTwo = () => {
  const result = getLowestLocation(parseSeedRanges())
  console.log(`Part 2: ${result}`)
}

partOne()
partTwo()

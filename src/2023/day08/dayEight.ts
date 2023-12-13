import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

// const input = `
// RL
//
// AAA = (BBB, CCC)
// BBB = (DDD, EEE)
// CCC = (ZZZ, GGG)
// DDD = (DDD, DDD)
// EEE = (EEE, EEE)
// GGG = (GGG, GGG)
// ZZZ = (ZZZ, ZZZ)
// `.trim()

// const input = `
// LLR
//
// AAA = (BBB, BBB)
// BBB = (AAA, ZZZ)
// ZZZ = (ZZZ, ZZZ)
// `.trim()

const debugInput = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

const lines = parseLines(input)

type Direction = 'R' | 'L'

const badInput = (line: string, lineNumber: number) => new Error(`Bad input on line ${lineNumber}: ${line}`)

const parseDirections = (): readonly Direction[] => {
  const directions = [...lines[0]]
  if (directions.every(c => c === 'R' || c === 'L')) {
    return directions as readonly Direction[]
  } else {
    throw badInput(lines[0], 1)
  }
}

const directions = parseDirections()

const startAt = 'AAA'
const endAt = 'ZZZ'

type Mapping = Readonly<{
  key: string
  L: string
  R: string
}>

const mappingRegex = /^(\w+)\s+=\s+\((\w+),\s(\w+)\)$/
const parseMapping = (index: number): Mapping => {
  const [key, L, R] = (mappingRegex.exec(lines[index]) ?? []).slice(1)
  if (key && L && R) {
    return { key, L, R }
  } else {
    throw badInput(lines[index], index + 1)
  }
}

const parseMappings = (): Readonly<Record<string, Mapping>> => {
  const mappings: Record<string, Mapping> = {}
  for (let i = 2; i < lines.length; i++) {
    const mapping = parseMapping(i)
    mappings[mapping.key] = mapping
  }
  return mappings
}

const mappings = parseMappings()

const getMapping = (key: string): Mapping => {
  const mapping = mappings[key]
  if (!mapping) {
    throw new Error(`No mapping for ${key}`)
  } else {
    return mapping
  }
}

const partOne = () => {
  if (mappings.AAA) {
    let key = startAt
    let steps = 0
    let directionIndex = 0
    while (key !== endAt) {
      key = getMapping(key)[directions[directionIndex]]
      steps++
      directionIndex = (directionIndex + 1) % directions.length
    }

    return steps
  } else {
    return 0
  }
}

const getDistanceToZ = (node: string): number => {
  let current = node
  let distance = 0
  let directionIndex = 0
  while (!current.endsWith('Z')) {
    distance++
    const direction = directions[directionIndex]
    current = getMapping(current)[direction]
    directionIndex = (directionIndex + 1) % directions.length
  }
  return distance
}

const gcd = (x: number, y: number): number => {
  if (y > x) {
    return gcd(y, x)
  } else {
    const mod = x % y
    if (mod === 0) {
      return y
    } else {
      return gcd(y, mod)
    }
  }
}

const lcm = (distances: readonly number[]): number => {
  const [x, ...rest] = distances
  if (rest.length === 1) {
    const [y] = rest
    return x * y / gcd(x, y)
  } else {
    return lcm([x, lcm(rest)])
  }
}

const partTwo = () => {
  const nodes = Object.keys(mappings).filter(_ => _.endsWith('A'))
  const distances = nodes.map(getDistanceToZ)
  return lcm(distances)
}

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

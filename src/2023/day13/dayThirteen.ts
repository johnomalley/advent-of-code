import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

const lines = parseLines(input)

type Pattern = readonly string[][]

const toPattern = (lines: readonly string[]): Pattern => lines.map(l => [...l])

const getPatterns = (): readonly Pattern[] => {
  const patterns: Pattern[] = []
  let startIndex = 0
  while (true) {
    const endIndex = lines.indexOf('', startIndex)
    if (endIndex < 0) {
      patterns.push(lines.slice(startIndex).map(l => [...l]))
      return patterns
    } else {
      patterns.push(toPattern(lines.slice(startIndex, endIndex)))
      startIndex = endIndex + 1
    }
  }
}

const patterns = getPatterns()

const getVerticalReflection = (pattern: Pattern, smudge: boolean): number => {
  const width = pattern[0].length
  const height = pattern.length
  const midPoint = Math.ceil(width / 2)

  const isReflection = (x: number) => {
    let smudgeFound = !smudge
    const length = x < midPoint ? x : width - x
    for (let y = 0; y < height; y++) {
      const chars = pattern[y]
      for (let i = 0; i < length; i++) {
        if (chars[x - i - 1] !== chars[x + i]) {
          if (smudgeFound) {
            return false
          } else {
            smudgeFound = true
          }
        }
      }
    }
    return smudgeFound
  }

  for (let x = 1; x < width; x++) {
    if (isReflection(x)) {
      return x
    }
  }

  return 0
}

const getHorizontalReflection = (pattern: Pattern, smudge: boolean): number => {
  const flipped = pattern[0].map((_, i) => pattern.map(row => row[i]))
  return getVerticalReflection(flipped, smudge)
}

const solve = (smudge: boolean): number =>
  patterns.map(p => getVerticalReflection(p, smudge) || getHorizontalReflection(p, smudge) * 100)
    .reduce((a, b) => a + b)

const partOne = () => solve(false)
const partTwo = () => solve(true)

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

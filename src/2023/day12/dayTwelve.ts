import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

type Row = Readonly<{
  data: string
  groups: readonly number[]
}>

const parseRow = (line: string, lineNumber: number): Row => {
  const [data, groupString] = line.split(/\s+/)
  if (data && groupString) {
    const groups = groupString.trim().split(',').map(Number)
    if (groups.every(Number.isInteger)) {
      return { data: data.trim(), groups }
    }
  }
  throw new Error(`Bad input on line ${lineNumber}: ${line}`)
}

const rows = parseLines(input).map((l, i) => parseRow(l, i + 1))

type Cache = Record<string, number>

const findNumberOfArrangements = ({ data, groups }: Row) => {
  const cache: Cache = {}

  const cacheResult = (key: string, fn: () => number): number => {
    const result = fn()
    cache[key] = result
    return result
  }

  const find = (dataIndex: number, groupIndex: number, matchLength: number): number => {
    const cacheKey = [dataIndex, groupIndex, matchLength].join(',')
    const cached = cache[cacheKey]
    if (cached !== undefined) {
      return cached
    } else {
      return cacheResult(cacheKey, (): number => {
        if (dataIndex === data.length) {
          if (groupIndex === groups.length) {
            // if we matched everything and there is no current match we are done
            return matchLength === 0 ? 1 : 0
          } else if (groupIndex === groups.length - 1 && matchLength === groups[groupIndex]) {
            // no '.' or '?' to terminate the last group so this counts as a match
            return 1
          } else {
            return 0
          }
        } else {
          const c = data[dataIndex]
          let result = 0
          // for '?' we simply add the two cases together
          if (c === '.' || c === '?') {
            if (matchLength === groups[groupIndex]) {
              result += find(dataIndex + 1, groupIndex + 1, 0)
            } else if (matchLength === 0) {
              result += find(dataIndex + 1, groupIndex, 0)
            }
          }
          if (c === '#' || c === '?') {
            result += find(dataIndex + 1, groupIndex, matchLength + 1)
          }
          return result
        }
      })
    }
  }

  return find(0, 0, 0)
}

const solve = (rows: readonly Row[], withLineNumbers: boolean = false) => {
  return rows
    .map((row, i) => {
      if (withLineNumbers) {
        console.log(i + 1)
      }
      return findNumberOfArrangements(row)
    })
    .reduce((a, b) => a + b)
}

const unfold = ({ data, groups }: Row): Row => {
  const array = [0, 1, 2, 3, 4]
  return {
    groups: array.flatMap(() => groups),
    data: array.flatMap(() => data).join('?')
  }
}
const partOne = () => solve(rows)

const partTwo = () => solve(rows.map(unfold))

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

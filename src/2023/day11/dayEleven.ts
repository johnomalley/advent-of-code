import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'
const debugInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

type Point = Readonly<{
  x: number
  y: number
}>

const lines = parseLines(input)

const toNumbers = (line: string): number[] => [...line].map(c => c === '#' ? 0 : 1)

const parseMatrix = (multiplier: number) => {
  const matrix = lines.map(toNumbers)
  const nonEmptyColumns: Record<number, boolean> = {}
  const galaxies: Point[] = []

  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y]
    const value = row.includes(0) ? 1 : multiplier
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 0) {
        galaxies.push({ x, y })
        nonEmptyColumns[x] = true
      } else {
        row[x] = value
      }
    }
  }

  for (let x = 0; x < matrix[0].length; x++) {
    if (!nonEmptyColumns[x]) {
      for (let y = 0; y < matrix.length; y++) {
        matrix[y][x] = multiplier
      }
    }
  }
  if (debug) {
    matrix.forEach(numbers => {
      console.log(numbers.join(''))
    })
  }

  return { matrix, galaxies }
}

const pathDistance = (matrix: readonly number[][], p1: Point, p2: Point) => {
  const x0 = Math.min(p1.x, p2.x)
  const y0 = Math.min(p1.y, p2.y)
  const x1 = Math.max(p1.x, p2.x)
  const y1 = Math.max(p1.y, p2.y)

  // make sure we cross each expanded row exactly once and each expanded column exactly once
  let distance = 0
  for (let x = x0 + 1; x <= x1; x++) {
    distance += Math.max(1, matrix[y0][x])
  }
  for (let y = y0 + 1; y <= y1; y++) {
    distance += Math.max(1, matrix[y][x1])
  }
  if (debug) {
    console.log(`${JSON.stringify(p1)} => ${JSON.stringify(p2)} = ${distance}`)
  }
  return distance
}

const getSum = (multiplier: number) => {
  const { matrix, galaxies } = parseMatrix(multiplier)
  let sum = 0
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += pathDistance(matrix, galaxies[i], galaxies[j])
    }
  }
  return sum
}

const partOne = () => getSum(2)

const partTwo = () => getSum(1000000)

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

import * as crypto from 'crypto'
import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

type Matrix = Readonly<{
  height: number
  width: number
  get: (x: number, y: number) => string
  set: (x: number, y: number, value: string) => void
}>

const moveRocks = (matrix: Matrix, x: number) => {
  let slots: number[] = []
  for (let y = 0; y < matrix.height; y++) {
    switch (matrix.get(x, y)) {
      case '.':
        slots.push(y)
        break
      case 'O':
        if (slots.length > 0) {
          matrix.set(x, slots[0], 'O')
          matrix.set(x, y, '.')
          slots = [...slots.slice(1), y]
        }
        break
      case '#':
        slots = []
    }
  }
}

const tilt = (matrix: Matrix) => {
  for (let x = 0; x < matrix.width; x++) {
    moveRocks(matrix, x)
  }
}

const tiltNorth = (grid: string[][]): Matrix => ({
  width: grid[0].length,
  height: grid.length,
  get: (x: number, y: number) => grid[y][x],
  set: (x: number, y: number, value: string) => {
    grid[y][x] = value
  }
})

const tiltEast = (grid: string[][]): Matrix => {
  const h = grid.length
  const w = grid[0].length
  return {
    width: h,
    height: w,
    get: (x: number, y: number) => grid[x][w - 1 - y],
    set: (x: number, y: number, value: string) => {
      grid[x][w - 1 - y] = value
    }
  }
}

const tiltSouth = (grid: string[][]): Matrix => {
  const h = grid.length
  const w = grid[0].length
  return {
    width: w,
    height: h,
    get: (x: number, y: number) => grid[h - 1 - y][w - 1 - x],
    set: (x: number, y: number, value: string) => {
      grid[h - 1 - y][w - 1 - x] = value
    }
  }
}

const tiltWest = (grid: string[][]): Matrix => {
  const h = grid.length
  const w = grid[0].length
  return {
    width: h,
    height: w,
    get: (x: number, y: number) => grid[h - 1 - x][y],
    set: (x: number, y: number, value: string) => {
      grid[h - 1 - x][y] = value
    }
  }
}

const getLoad = (grid: string[][]) => {
  let result = 0
  const height = grid.length
  const width = grid[0].length
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'O') {
        result += height - y
      }
    }
  }

  return result
}

const parseGrid = () => parseLines(input).map(line => [...line])

const partOne = () => {
  const grid = parseGrid()
  const tiltNorthMatrix = tiltNorth(grid)
  tilt(tiltNorthMatrix)
  return getLoad(grid)
}

type CycleRun = Readonly<{
  result: number
  hash: string
}>

const toHashString = (grid: string[][]) => grid.map(_ => _.join('')).join('')

const showPattern = (grid: string[][]) => {
  grid.forEach(line => {
    console.log(line.join(''))
  })
  console.log('')
}

const partTwo = () => {
  const grid = parseGrid()
  const runs: CycleRun[] = []
  const northMatrix = tiltNorth(grid)
  const westMatrix = tiltWest(grid)
  const southMatrix = tiltSouth(grid)
  const eastMatrix = tiltEast(grid)
  let first = true
  const cycle = (i: number): CycleRun => {
    const show = first && debug
    first = false
    tilt(northMatrix)
    if (show) {
      console.log('north')
      showPattern(grid)
    }
    tilt(westMatrix)
    if (show) {
      console.log('west')
      showPattern(grid)
    }
    tilt(southMatrix)
    if (show) {
      console.log('south')
      showPattern(grid)
    }
    tilt(eastMatrix)
    if (show) {
      console.log('cycle 1')
      showPattern(grid)
    } else if (debug) {
      console.log(`cycle ${i + 1}`)
      showPattern(grid)
    }

    return {
      result: getLoad(grid),
      hash: crypto.createHash('md5').update(toHashString(grid)).digest('hex')
    }
  }

  const findRepeatedRun = (run: CycleRun): number => {
    for (let i = 0; i < runs.length; i++) {
      const { result, hash } = runs[i]
      if (result === run.result && hash === run.hash) {
        return i
      }
    }
    return -1
  }

  const cycles = 1000000000
  const maxAttempts = 1000
  for (let i = 0; i < maxAttempts; i++) {
    const run = cycle(i)
    const index = findRepeatedRun(run)
    if (debug) {
      console.log(`run ${i + 1}: ${run.result}`)
    }
    if (index < 0) {
      // save result and a hash of the grid
      runs.push(run)
    } else {
      // repeats every N times
      const repeatsEvery = i - index
      // for example if cycles is 16 and indices 6 and 10 match
      // runs.length is 10
      // offset - (16 - 10 - 1) % 4 -> 1
      // repeats every 4
      // value after 16 cycles would be values[15] or values[11] or values[7] which we have already
      // the index for the solution is 1 + 10 -> 11
      const offset = (cycles - runs.length - 1) % repeatsEvery
      return runs[index + offset].result
    }
  }
  throw new Error(`No repeating pattern found after ${maxAttempts} attempts`)
}

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

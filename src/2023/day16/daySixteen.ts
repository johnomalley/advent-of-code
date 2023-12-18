import defaultInput from './input'
import { type DayOfCode } from '../allDays'
import parseLines from '../../parseLines'

const debugInput = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

type Point = Readonly<{
  x: number
  y: number
}>

type Delta = Readonly<{
  dx: number
  dy: number
}>

type Direction = 'north' | 'south' | 'east' | 'west'

const deltaByDirection: Readonly<Record<Direction, Delta>> = {
  north: { dx: 0, dy: -1 },
  south: { dx: 0, dy: 1 },
  east: { dx: 1, dy: 0 },
  west: { dx: -1, dy: 0 }
}

const solve = (lines: readonly string[], startingPoint: Point, direction: Direction): number => {
  const points: Record<string, Partial<Record<Direction, boolean>>> = {}
  let count = 0

  const add = ({ x, y }: Point, d: Direction): boolean => {
    const key = `${x},${y}`
    let directions = points[key]
    if (!directions) {
      count++
      directions = {}
      points[key] = directions
    }
    if (directions[d]) {
      return false
    } else {
      directions[d] = true
      return true
    }
  }

  const inRange = ({ x, y }: Point) =>
    y >= 0 && y < lines.length && x >= 0 && x < lines[y].length

  const getMoves = (c: string, d: Direction): Direction[] => {
    if (c === '-' && (d === 'north' || d === 'south')) {
      return ['east', 'west']
    } else if (c === '|' && (d === 'east' || d === 'west')) {
      return ['north', 'south']
    } else if (c === '/') {
      switch (d) {
        case 'north':
          return ['east']
        case 'south':
          return ['west']
        case 'east':
          return ['north']
        case 'west':
          return ['south']
      }
    } else if (c === '\\') {
      switch (d) {
        case 'north':
          return ['west']
        case 'south':
          return ['east']
        case 'east':
          return ['south']
        case 'west':
          return ['north']
      }
    } else {
      return [d]
    }
  }

  const move = (point: Point, direction: Direction) => {
    if (inRange(point) && add(point, direction)) {
      const c = lines[point.y][point.x]
      getMoves(c, direction).forEach(d => {
        const { dx, dy } = deltaByDirection[d]
        move({ x: point.x + dx, y: point.y + dy }, d)
      })
    }
  }

  move(startingPoint, direction)
  return count
}

const partOne = () => solve(parseLines(input), { x: 0, y: 0 }, 'east')

const partTwo = () => {
  const lines = parseLines(input)
  let max = 0
  const maxX = lines[0].length - 1
  const maxY = lines.length - 1
  for (let y = 0; y <= maxY; y++) {
    max = Math.max(max, solve(lines, { x: 0, y }, 'east'))
    max = Math.max(max, solve(lines, { x: maxX, y }, 'west'))
  }
  for (let x = 0; x <= maxX; x++) {
    max = Math.max(max, solve(lines, { x, y: 0 }, 'south'))
    max = Math.max(max, solve(lines, { x, y: maxY }, 'north'))
  }
  return max
}

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

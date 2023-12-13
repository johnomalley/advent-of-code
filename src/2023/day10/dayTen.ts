import defaultInput from './input'
import polygonArea, { type Point } from './polygonArea'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`.trim()

const debug = false
const input = debug ? debugInput : defaultInput

const inputLines = parseLines(input)

type Direction = 'north' | 'south' | 'east' | 'west'

type Connections = Readonly<Record<Direction, boolean>>

const emptyConnections: Connections = {
  north: false,
  south: false,
  east: false,
  west: false
}

type Move = Readonly<[number, number]>

type Tile = Readonly<{
  symbol: string
  connections: Connections
  moves: Readonly<Partial<Record<Direction, Move>>>
}>

const getTile = (symbol: string, c: Partial<Connections>): Tile => {
  const connections = { ...emptyConnections, ...c }
  const moves: Partial<Record<Direction, Move>> = {}
  if (connections.north) {
    moves.north = [0, -1]
  }
  if (connections.south) {
    moves.south = [0, 1]
  }
  if (connections.east) {
    moves.east = [1, 0]
  }
  if (connections.west) {
    moves.west = [-1, 0]
  }
  return { symbol, connections, moves }
}

const verticalTile: Tile = getTile('|', { north: true, south: true })

const horizontalTile: Tile = getTile('-', { east: true, west: true })

const northeastTile: Tile = getTile('L', { north: true, east: true })

const northwestTile: Tile = getTile('J', { north: true, west: true })

const southwestTile: Tile = getTile('7', { south: true, west: true })

const southeastTile: Tile = getTile('F', { south: true, east: true })

const groundTile = getTile('.', {})

const startingTile = getTile('S', { north: true, south: true, east: true, west: true })

const allTiles: readonly Tile[] = [
  verticalTile,
  horizontalTile,
  northeastTile,
  northwestTile,
  southwestTile,
  southeastTile,
  groundTile,
  startingTile
]

const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case 'north':
      return 'south'
    case 'south':
      return 'north'
    case 'west':
      return 'east'
    default:
      return 'west'
  }
}
const getTilesBySymbol = (): Readonly<Record<string, Tile>> => {
  const tilesBySymbol: Record<string, Tile> = {}
  allTiles.forEach(t => {
    tilesBySymbol[t.symbol] = t
  })
  return tilesBySymbol
}

const tilesBySymbol = getTilesBySymbol()

const tileGrid: Tile[][] = []
inputLines.forEach(line => {
  const tiles: Tile[] = []
  for (let x = 0; x < line.length; x++) {
    const tile = tilesBySymbol[line[x]]
    if (!tile) {
      throw new Error(`Unrecognized symbol ${line[x]}`)
    } else {
      tiles.push(tile)
    }
  }
  tileGrid.push(tiles)
})

const getTileAt = (x: number, y: number): Tile => tileGrid[y]?.[x] ?? groundTile

const getStartingPoint = (): Point => {
  for (let y = 0; y < inputLines.length; y++) {
    const x = inputLines[y].indexOf(startingTile.symbol)
    if (x >= 0) {
      return { x, y }
    }
  }
  throw new Error('Starting position not found in the maze')
}

const forEachItemInPath = (fn: (p: Point) => void) => {
  const startingPosition = getStartingPoint()
  let position = startingPosition
  let lastPosition = startingPosition
  let tile = startingTile

  const findNext = () => {
    const directions = Object.keys(tile.moves) as Direction[]

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i]
      const [dx, dy] = tile.moves[direction]!
      const nextPosition = { x: position.x + dx, y: position.y + dy }
      if (nextPosition.x !== lastPosition.x || nextPosition.y !== lastPosition.y) {
        const nextTile = getTileAt(nextPosition.x, nextPosition.y)
        if (nextTile.connections[getOppositeDirection(direction)]) {
          lastPosition = position
          position = nextPosition
          tile = nextTile
          return
        }
      }
    }
    throw new Error(`No next position found at ${position.x}, ${position.y}`)
  }

  do {
    findNext()
    fn(position)
    // eslint-disable-next-line no-unmodified-loop-condition
  } while (tile !== startingTile)
}

const partOne = () => {
  let pathLength = 0
  forEachItemInPath(() => {
    pathLength++
  })
  return Math.floor(pathLength / 2)
}

const getStartingTileShape = ({ x, y }: Point) => {
  const north = getTileAt(x, y - 1)
  const south = getTileAt(x, y + 1)
  const west = getTileAt(x - 1, y)
  const east = getTileAt(x + 1, y)
  if (north.connections.south && south.connections.north) {
    return verticalTile
  } else if (east.connections.west && west.connections.east) {
    return horizontalTile
  } else if (north.connections.south && west.connections.east) {
    return northwestTile
  } else if (north.connections.south && east.connections.west) {
    return northeastTile
  } else if (south.connections.north && west.connections.east) {
    return southwestTile
  } else if (south.connections.north && east.connections.west) {
    return southeastTile
  } else {
    throw new Error(`Starting tile at ${x},${y} does not connect!`)
  }
}
const getTileAsShape = (p: Point, tile: Tile): Tile => tile === startingTile ? getStartingTileShape(p) : tile

const partTwo = () => {
  const vertices: Point[] = []
  let pointCount = 0
  forEachItemInPath(p => {
    pointCount++
    switch (getTileAsShape(p, tileGrid[p.y][p.x])) {
      case northwestTile:
      case northeastTile:
      case southeastTile:
      case southwestTile:
        vertices.push(p)
    }
  })

  return polygonArea(vertices) - pointCount / 2 + 1
}

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

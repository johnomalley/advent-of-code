import input from './input'

type Counts = Readonly<{
  red: number
  green: number
  blue: number
}>

const emptyCounts: Counts = {
  red: 0,
  green: 0,
  blue: 0
}

type Game = Readonly<{
  id: number
  draws: readonly Counts[]
}>

const gameRegex = /^Game (\d+): (.*)$/
const drawRegex = /^(\d+) (\w+)/

const colors = ['red', 'green', 'blue']
const parseDraw = (balls: string, lineNumber: number): Counts => {
  let counts = emptyCounts
  balls.split(',').forEach(ballCountString => {
    const [countString, colorString] = (drawRegex.exec(ballCountString.trim()) ?? []).slice(1)
    const count = Number(countString)
    const color = colors.includes(colorString) ? colorString : undefined
    if (Number.isInteger(count) && color) {
      counts = {
        ...counts,
        [color as keyof Counts]: count
      }
    } else {
      throw new Error(`Bad input on line ${lineNumber}: ${ballCountString}`)
    }
  })
  return counts
}

// 3 green, 14 blue; 2 blue, 2 green, 6 red; 1 red, 11 blue, 1 green; 3 green, 4 red, 20 blue; 6 red, 2 green, 3 blue; 10 blue, 12 red
const parseDraws = (input: string, lineNumber: number): readonly Counts[] =>
  input.split(';').map(s => parseDraw(s.trim(), lineNumber))

const parseGame = (line: string, lineNumber: number): Game => {
  const [idString, rest] = (gameRegex.exec(line) ?? []).slice(1)
  if (idString && rest) {
    const id = Number(idString)
    if (Number.isInteger(id)) {
      return {
        id,
        draws: parseDraws(rest, lineNumber)
      }
    } else {
      throw new Error(`Bad ID on line ${lineNumber}: ${idString}`)
    }
  } else {
    throw new Error(`Bad input line ${lineNumber}: ${line}`)
  }
}

const games = input.split('\n')
  .map((line, i) => parseGame(line.trim(), i + 1))

const target: Counts = {
  red: 12,
  green: 13,
  blue: 14
}

const isPossible = ({ draws }: Game) =>
  draws.every(({ red, green, blue }) =>
    red <= target.red && green <= target.green && blue <= target.blue
  )

const partOne = () => {
  const sum = games.filter(isPossible).map(_ => _.id).reduce((a, b) => a + b)

  console.log(`Part 1: ${sum}`)
}

const getPowerOfMinimum = (game: Game) => {
  let { red, green, blue } = game.draws[0] ?? emptyCounts
  game.draws.slice(1).forEach(draw => {
    red = Math.max(red, draw.red)
    green = Math.max(green, draw.green)
    blue = Math.max(blue, draw.blue)
  })
  return red * green * blue
}

const partTwo = () => {
  const sum = games.map(getPowerOfMinimum).reduce((a, b) => a + b)

  console.log(`Part 2: ${sum}`)
}

partOne()
partTwo()

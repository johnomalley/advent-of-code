import input from './input'
// const input = `
// Time:      7  15   30
// Distance:  9  40  200
// `.trim()

const timeRegex = /^Time:\s+(.*)$/
const distanceRegex = /^Distance:\s+(.*)$/

type Race = Readonly<{
  time: number
  distance: number
}>

const parseNumbers = (regex: RegExp, input: string): number[] => {
  const [numberString] = (regex.exec(input) ?? []).slice(1)
  if (numberString) {
    const result = numberString.split(/\s+/).map(Number)
    if (result.every(Number.isInteger)) {
      return result
    }
  }
  throw new Error(`Bad input line ${input}`)
}

const parseRaces = (): readonly Race[] => {
  const lines = input.split('\n')
  const times = parseNumbers(timeRegex, lines[0])
  const distances = parseNumbers(distanceRegex, lines[1])
  if (times.length > 0 && times.length === distances.length) {
    return times.map((time, i) => ({
      time,
      distance: distances[i]
    }))
  } else {
    throw new Error(`Bad input: ${JSON.stringify({ times, distances })}`)
  }
}

const races = parseRaces()

const beatsRecord = (race: Race, value: number) => race.distance < (race.time - value) * value

const findLowerBound = (race: Race, start: number, end: number): number => {
  const mid = Math.floor((start + end) / 2)
  if (beatsRecord(race, mid)) {
    if (!beatsRecord(race, mid - 1)) {
      return mid
    } else {
      return findLowerBound(race, start, mid)
    }
  } else {
    return findLowerBound(race, mid + 1, end)
  }
}

const findUpperBound = (race: Race, start: number, end: number): number => {
  const mid = Math.floor((start + end) / 2)
  // console.log(JSON.stringify({ start, end, mid }))
  if (beatsRecord(race, mid)) {
    if (!beatsRecord(race, mid + 1)) {
      return mid
    } else {
      return findUpperBound(race, mid + 1, end)
    }
  } else {
    return findUpperBound(race, start, mid - 1)
  }
}

const getNumberOfWaysToBeatRecord = (race: Race) => 1 + findUpperBound(race, 0, race.time) - findLowerBound(race, 0, race.time)

const partOne = () => {
  let result = 1
  races.forEach(race => {
    result *= getNumberOfWaysToBeatRecord(race)
  })
  console.log(`Part 1: ${result}`)
}

const partTwo = () => {
  const longRace: Race = {
    time: Number(races.map(_ => _.time).join('')),
    distance: Number(races.map(_ => _.distance).join(''))
  }
  const result = getNumberOfWaysToBeatRecord(longRace)
  console.log(`Part 2: ${result}`)
}

partOne()
partTwo()

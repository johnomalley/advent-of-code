import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

const inputLines = parseLines(input)

const parseLine = (line: string, lineNumber: number) => {
  const result = line.split(/\s+/).map(Number)
  if (result.every(Number.isInteger)) {
    return result
  } else {
    throw new Error(`Bad input at line ${lineNumber}: ${line}`)
  }
}

const lines = inputLines.map((l, i) => parseLine(l, i + 1))

const getNextLine = (line: readonly number[]): number[] => {
  const nextLine: number[] = []
  for (let i = 1; i < line.length; i++) {
    nextLine.push(line[i] - line[i - 1])
  }
  return nextLine
}

const getPredictionMatrix = (line: number[]) => {
  const lines = [line]
  while (true) {
    const nextLine = getNextLine(lines[lines.length - 1])
    lines.push(nextLine)
    if (nextLine.every(_ => _ === 0)) {
      break
    }
  }
  return lines
}

const getNextValue = (line: number[]): number => {
  const matrix = getPredictionMatrix(line)
  matrix[matrix.length - 1].push(0)
  let index = matrix.length - 2
  while (true) {
    const l = matrix[index]
    const next = matrix[index + 1]
    const i = l.length - 1
    const value = l[i] + next[i]
    if (index === 0) {
      return value
    } else {
      l.push(value)
      index--
    }
  }
}

const partOne = () => lines.map(getNextValue).reduce((a, b) => a + b)

const insert = (numbers: number[], value: number) => {
  numbers.splice(0, 0, value)
}

const getPrevValue = (line: number[]): number => {
  const matrix = getPredictionMatrix(line)
  insert(matrix[matrix.length - 1], 0)
  let index = matrix.length - 2
  while (true) {
    const l = matrix[index]
    const next = matrix[index + 1]
    const value = l[0] - next[0]
    if (index === 0) {
      return value
    } else {
      insert(l, value)
      index--
    }
  }
}

const partTwo = () => lines.map(getPrevValue).reduce((a, b) => a + b)

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

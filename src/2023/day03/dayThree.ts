import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput
const lines = parseLines(input)

const isSymbol = (c: string | undefined) => Boolean(c && (c < '0' || c > '9') && c !== '.')

const isDigit = (c: string | undefined) => Boolean(c && c >= '0' && c <= '9')

const getLineSum = (line: string, i: number): number => {
  if (debug) {
    console.log(i)
    console.log('----')
  }
  const before = lines[i - 1] ?? ''
  const after = lines[i + 1] ?? ''

  const isAdjacentToSymbol = (start: number, end: number) => {
    if (isSymbol(line[start - 1]) || isSymbol(line[end])) {
      return true
    }

    for (let i = start - 1; i < end + 1; i++) {
      if (isSymbol(before[i]) || isSymbol(after[i])) {
        return true
      }
    }
    return false
  }

  let sum = 0

  let numberString = ''
  for (let i = 0; i <= line.length; i++) {
    const c = line[i]
    if (isDigit(c)) {
      numberString = numberString + c
    } else if (numberString) {
      if (isAdjacentToSymbol(i - numberString.length, i)) {
        sum += Number(numberString)
        if (debug) {
          console.log(numberString)
          console.log(`sum=${sum}`)
        }
      } else if (debug) {
        console.log(`not: ${numberString}`)
      }
      numberString = ''
    }
  }

  return sum
}

const partOne = () => lines.map(getLineSum).reduce((a, b) => a + b)

const getNumberAt = (line: string, column: number): number | undefined => {
  const c = line[column]
  if (isDigit(c)) {
    let start = column - 1
    while (isDigit(line[start])) {
      start--
    }
    let end = column + 1
    while (isDigit(line[end])) {
      end++
    }
    return Number(line.slice(start + 1, end))
  }
}

const isNumber = (n: number | undefined): n is number => n !== undefined

const getAdjacentPartNumbersOnLine = (line: string, column: number): number[] => {
  const number = getNumberAt(line, column)
  if (number !== undefined) {
    return [number]
  } else {
    const left = getNumberAt(line, column - 1)
    const right = getNumberAt(line, column + 1)
    return [left, right].filter(isNumber)
  }
}

const getAdjacentPartNumbers = (row: number, column: number): number[] => {
  return [
    ...getAdjacentPartNumbersOnLine(lines[row - 1] ?? '', column),
    ...getAdjacentPartNumbersOnLine(lines[row + 1] ?? '', column),
    getNumberAt(lines[row], column - 1),
    getNumberAt(lines[row], column + 1)
  ].filter(isNumber)
}

const getGearRatio = (row: number, column: number): number => {
  const symbol = lines[row][column]
  if (symbol === '*') {
    const numbers = getAdjacentPartNumbers(row, column)
    if (numbers.length === 2) {
      return numbers[0] * numbers[1]
    }
  }
  return 0
}

const partTwo = () => {
  let sum = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (let j = 0; j < line.length; j++) {
      sum += getGearRatio(i, j)
    }
  }
  return sum
}

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

const lines = parseLines(input)

const digits = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

const isDigit = (c: string): boolean => c >= '0' && c <= '9'

const getDigits = (line: string, lineNumber: number): [number, number] => {
  const getDigitAt = (i: number): number | undefined => {
    const c = line.charAt(i)
    if (isDigit(c)) {
      return Number(c)
    } else {
      for (let j = 0; j < digits.length; j++) {
        const digitWord = digits[j]
        if (line.slice(i, i + digitWord.length) === digitWord) {
          return Number(j)
        }
      }
    }
    return undefined
  }

  let first: number | undefined
  let second: number | undefined

  for (let index = 0; index < line.length; index++) {
    const d = getDigitAt(index)
    if (d !== undefined) {
      if (first === undefined) {
        first = d
      } else {
        second = d
      }
    }
  }

  if (first !== undefined) {
    return [first, second ?? first]
  } else {
    throw new Error(`bad value - line ${lineNumber}: ${line}`)
  }
}

const getPartOneValue = (line: string, lineNumber: number): number => {
  const digits: string[] = []
  for (let i = 0; i < line.length; i++) {
    if (isDigit(line[i])) {
      digits.push(line[i])
    }
  }
  if (digits.length > 0) {
    return Number(`${digits[0]}${digits[digits.length - 1]}`)
  } else {
    throw new Error(`bad value - line ${lineNumber}: ${line}`)
  }
}

const partOne = () => {
  let sum = 0

  lines.forEach((l, i) => {
    sum += getPartOneValue(l, i + 1)
  })

  return sum
}

const partTwo = () => {
  const getValue = (line: string, lineNumber: number): number => Number(getDigits(line, lineNumber).join(''))

  let sum = 0
  lines.forEach((l, i) => {
    sum += getValue(l, i + 1)
  })
  return sum
}

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

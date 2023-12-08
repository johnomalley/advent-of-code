import input from './input'

const lines = input.split('\n')

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

const getDigits = (line: string, lineNumber: number): [number, number] => {
  const getDigitAt = (i: number): number | undefined => {
    const c = line.charAt(i)
    if (c >= '0' && c <= '9') {
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

const getValue = (line: string, lineNumber: number): number => Number(getDigits(line, lineNumber).join(''))

let sum = 0
lines.forEach((l, i) => {
  sum += getValue(l, i + 1)
})

console.log(`first line ${lines[0]}, final line ${lines[lines.length - 1]}`)
console.log(sum)

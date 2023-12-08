import input from './input'

// const input = `
// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
// `.trim()

// const lines = input.split('\n')
const lines = input.split('\n').slice(90, 95)

const debug = true
if (debug) {
  lines.forEach(_ => {
    console.log(_)
  })
}

const isSymbol = (c: string | undefined) => Boolean(c && (c < '0' || c > '9') && c !== '.')

const getLineSum = (line: string, i: number): number => {
  if (line.length !== 140) {
    throw new Error(`! ${line.length}`)
  }
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
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c >= '0' && c <= '9') {
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

const partOne = () => {
  const sum = lines.map(getLineSum).reduce((a, b) => a + b)
  console.log(`Part 1: ${sum}`)
}

partOne()

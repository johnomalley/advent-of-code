import input from './input'

// const input = `
// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
// `.trim()

const cardRegex = /^Card\s+\d+: (.*)$/

const lines = input.split('\n')

const parseNumbers = (input: string) => input.split(/\s/).map(_ => _.trim()).filter(Boolean).map(Number)

// const debug = true

const getMatchingNumberCount = (left: number[], right: number[]) => {
  let count = 0
  right.forEach(n => {
    if (left.includes(n)) {
      count++
    }
  })
  return count
}

const getWinningNumberCount = (line: string, lineNumber: number): number => {
  const [data] = (cardRegex.exec(line) ?? []).slice(1)
  if (data) {
    const sections = data.split('|')
    if (sections.length === 2) {
      const [winningNumbers, cardNumbers] = sections.map(parseNumbers)
      return getMatchingNumberCount(winningNumbers, cardNumbers)
    }
  }
  throw new Error(`line ${lineNumber}: bad input ${line}`)
}

const getLineScore = (line: string, lineNumber: number): number => {
  const count = getWinningNumberCount(line, lineNumber)
  return count < 2 ? count : Math.pow(2, count - 1)
}

const partOne = () => {
  const sum = lines
    .map((line, i) => getLineScore(line.trim(), i + 1))
    .reduce((a, b) => a + b)
  console.log(`Part 1: ${sum}`)
}

const partTwo = () => {
  const cardCounts = lines.map(_ => 1)

  lines.forEach((line, i) => {
    const count = getWinningNumberCount(line, i + 1)
    if (count > 0) {
      for (let j = 1; j <= count; j++) {
        const countIndex = j + i
        if (countIndex < cardCounts.length) {
          cardCounts[countIndex] += cardCounts[i]
        }
      }
    }
  })

  const total = cardCounts.reduce((a, b) => a + b)

  console.log(`Part 2: ${total}`)
}

partOne()
partTwo()

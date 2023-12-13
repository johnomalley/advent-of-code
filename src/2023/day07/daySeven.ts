import defaultInput from './input'
import parseLines from '../../parseLines'
import { type DayOfCode } from '../allDays'

const debugInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

const lines = parseLines(input)

const defaultCardRankings = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A'
] as const

const jokerRankings: readonly Card[] = [
  'J',
  ...defaultCardRankings.filter(_ => _ !== 'J')
]

type Card = typeof defaultCardRankings[number]

enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind
}

type Hand = Readonly<{
  bid: number
  cards: readonly Card[]
  handType: HandType
}>

type CardCounts = Partial<Record<Card, number>>

const getCardCounts = (cards: readonly Card[]): Readonly<CardCounts> => {
  const counts: CardCounts = {}
  cards.forEach(c => {
    counts[c] = (counts[c] ?? 0) + 1
  })
  return counts
}

const partOneHandScorer = (cardCounts: Readonly<CardCounts>): HandType => {
  const keys = Object.keys(cardCounts) as Card[]
  switch (keys.length) {
    case 1:
      return HandType.FiveOfAKind
    case 2:
      // eslint-disable-next-line no-case-declarations
      const count = cardCounts[keys[0]]
      return count === 2 || count === 3 ? HandType.FullHouse : HandType.FourOfAKind
    case 3:
      return keys.some(_ => cardCounts[_] === 2) ? HandType.TwoPair : HandType.ThreeOfAKind
    case 4:
      return HandType.OnePair
    default:
      return HandType.HighCard
  }
}

const handRegex = /^(\w+)\s+(\d+)$/

type HandScorer = (cardCounts: Readonly<CardCounts>) => number

const parseHand = (line: string, lineNumber: number, handScorer: HandScorer): Hand => {
  const [rawHand, rawBid] = (handRegex.exec(line) ?? []).slice(1)
  if (rawHand && rawBid) {
    const cards = [...rawHand] as Card[]
    const bid = Number(rawBid)
    if (Number.isInteger(bid) && cards.length === 5 && cards.every(_ => defaultCardRankings.includes(_))) {
      return { bid, cards, handType: handScorer(getCardCounts(cards)) }
    }
  }
  throw new Error(`Invalid hand format on line ${lineNumber}: ${line}`)
}

const getHandComparator = (cardRankings: readonly Card[]) =>
  (left: Hand, right: Hand): number => {
    if (left.handType === right.handType) {
      for (let i = 0; i < 5; i++) {
        const l = left.cards[i]
        const r = right.cards[i]
        if (l !== r) {
          return cardRankings.indexOf(l) - cardRankings.indexOf(r)
        }
      }
      return 0
    } else {
      return left.handType - right.handType
    }
  }

const getResult = (cardRankings: readonly Card[], handScorer: HandScorer) => {
  const hands = lines.map((line, i) => parseHand(line, i + 1, handScorer))
  const sorted = [...hands].sort(getHandComparator(cardRankings))
  let total = 0
  sorted.forEach((hand, i) => {
    total += (i + 1) * hand.bid
  })
  return total
}

const partTwoHandScorer = (cardCounts: Readonly<CardCounts>): HandType => {
  const jokerCount = cardCounts.J
  if (!jokerCount) {
    return partOneHandScorer(cardCounts)
  } else {
    const { J, ...rest } = cardCounts
    let maxScore = HandType.HighCard
    const candidates = Object.keys(rest) as Card[]
    if (candidates.length === 0) {
      // edge case - five jokers
      return HandType.FiveOfAKind
    }
    candidates.forEach((card: Card) => {
      const count: number = (rest as CardCounts)[card]! + jokerCount
      maxScore = Math.max(maxScore, partOneHandScorer({
        ...rest,
        [card]: count
      }))
    })
    return maxScore
  }
}

const partOne = () => getResult(defaultCardRankings, partOneHandScorer)

const partTwo = () => getResult(jokerRankings, partTwoHandScorer)

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

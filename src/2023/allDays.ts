import dayOne from './day01/dayOne'
import dayTwo from './day02/dayTwo'
import dayThree from './day03/dayThree'
import dayFour from './day04/dayFour'
import dayFive from './day05/dayFive'
import daySix from './day06/daySix'
import daySeven from './day07/daySeven'
import dayEight from './day08/dayEight'
import dayNine from './day09/dayNine'
import dayTen from './day10/dayTen'
import dayEleven from './day11/dayEleven'
import dayTwelve from './day12/dayTwelve'
import dayThirteen from './day13/dayThirteen'

export type DayOfCode = Readonly<{
  partOne: () => number
  partTwo: () => number
}>

const allDays: readonly DayOfCode[] = [
  dayOne,
  dayTwo,
  dayThree,
  dayFour,
  dayFive,
  daySix,
  daySeven,
  dayEight,
  dayNine,
  dayTen,
  dayEleven,
  dayTwelve,
  dayThirteen
]

export default allDays

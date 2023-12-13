import allDays from './allDays'

const args = process.argv.slice(2)
if (args.length !== 1) {
  console.error(`Expected 1 argument, got ${args.length}`)
  process.exit(1)
}

const day = Number(args[0])

if (Number.isInteger(day) && day > 0 && day <= allDays.length) {
  console.log(`Day ${day}`)
  console.log('*****' + (day < 10 ? '' : '*'))
  const { partOne, partTwo } = allDays[day]
  console.log(`Part 1: ${partOne()}`)
  console.log(`Part 2: ${partTwo()}`)
  process.exit(0)
} else {
  console.error(`Bad argument: ${args[0]} - must be an integer between 1 and ${allDays.length}`)
  process.exit(1)
}

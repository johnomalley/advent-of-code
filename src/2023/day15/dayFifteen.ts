import defaultInput from './input'
import { type DayOfCode } from '../allDays'

const debugInput = `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`.trim()

const debug = false

const input = debug ? debugInput : defaultInput

const getHash = (value: string): number => {
  // eslint-disable-next-line prefer-const
  let result = 0
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    result += code
    result *= 17
    result %= 256
  }
  return result
}
const partOne = (): number => input.split(',').map(getHash).reduce((a, b) => a + b)

type Lens = Readonly<{
  label: string
  focalLength: number
}>

type Step = Readonly<{
  label: string
  action: 'add' | 'remove'
  focalLength?: number
}>

class Box {
  readonly index: number
  lenses: Lens[] = []

  constructor (index: number) {
    this.index = index
  }

  addOrReplace (lens: Lens) {
    const index = this.lenses.findIndex(_ => _.label === lens.label)
    if (index < 0) {
      this.lenses.push(lens)
    } else {
      this.lenses.splice(index, 1, lens)
    }
  }

  remove (label: string) {
    const index = this.lenses.findIndex(_ => _.label === label)
    if (index >= 0) {
      this.lenses.splice(index, 1)
    }
  }

  isEmpty (): boolean {
    return this.lenses.length === 0
  }

  toString () {
    return `Box ${this.index}: ${this.lenses.map(({ label, focalLength }) => `[${label} ${focalLength}]`).join(' ')}`
  }
}

const parseStep = (rawValue: string): Step => {
  const [label, focalLength] = rawValue.split(/[=-]/)
  if (focalLength.length > 0) {
    return { label, action: 'add', focalLength: Number(focalLength) }
  } else {
    return { label, action: 'remove' }
  }
}

const getFocusingPower = (boxes: readonly Box[]): number => {
  let result = 0
  boxes.filter(_ => !_.isEmpty()).forEach(box => {
    const boxNumber = box.index + 1
    box.lenses.forEach(({ label, focalLength }, i) => {
      const power = boxNumber * (i + 1) * focalLength
      if (debug) {
        console.log(`Box ${0} Lens ${i} ${label} length=${focalLength} ${power}`)
      }
      result += power
    })
  })
  return result
}

const partTwo = () => {
  const steps = input.split(',').map(parseStep)
  const boxes: Box[] = []
  for (let i = 0; i < 256; i++) {
    boxes.push(new Box(i))
  }
  steps.forEach(({ label, action, focalLength }) => {
    const box = boxes[getHash(label)]
    if (action === 'remove') {
      box.remove(label)
    } else {
      box.addOrReplace({ label, focalLength: focalLength! })
    }
    if (debug) {
      const nonEmpty = boxes.filter(_ => !_.isEmpty())
      console.log(`${action} ${label} ${focalLength ?? ''}`)
      nonEmpty.forEach(b => {
        console.log(b.toString())
      })
      console.log('')
    }
  })
  return getFocusingPower(boxes)
}

const dayOfCode: DayOfCode = { partOne, partTwo }

export default dayOfCode

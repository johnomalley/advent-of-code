export type Point = Readonly<{
  x: number
  y: number
}>

export default function polygonArea (vertices: readonly Point[]): number {
  let sum = 0
  for (let n = 0; n < vertices.length; n++) {
    const p1 = vertices[n]
    const p2 = vertices[(n + 1) % vertices.length]
    sum += (p1.x * p2.y) - (p1.y * p2.x)
  }
  return Math.abs(sum) / 2
}
//
// const pentagon: readonly Point[] = [
//   { x: 1, y: 6 },
//   { x: 3, y: 1 },
//   { x: 7, y: 2 },
//   { x: 4, y: 4 },
//   { x: 8, y: 5 }
// ]
//
// console.log(areaOfPolygon(pentagon))
// console.log(areaOfPolygon([...pentagon].reverse()))

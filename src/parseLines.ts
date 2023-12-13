export default function parseLines (text: string): readonly string[] {
  return text.split('\n').map(_ => _.trim())
}

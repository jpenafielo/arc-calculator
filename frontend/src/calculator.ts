export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percent'

export const operations: { id: Operation; label: string; symbol: string }[] = [
  { id: 'add', label: 'Add', symbol: '+' },
  { id: 'subtract', label: 'Subtract', symbol: '−' },
  { id: 'multiply', label: 'Multiply', symbol: '×' },
  { id: 'divide', label: 'Divide', symbol: '÷' },
  { id: 'power', label: 'Power', symbol: 'xʸ' },
  { id: 'sqrt', label: 'Square root', symbol: '√' },
  { id: 'percent', label: 'Percentage', symbol: '%' },
]

export function parseNumber(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function formatResult(value: number): string {
  const absolute = Math.abs(value)
  if (absolute >= 1e12 || (absolute > 0 && absolute < 1e-6)) {
    return value.toExponential(8)
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 12 }).format(value)
}

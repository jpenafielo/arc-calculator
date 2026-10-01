import { formatResult, parseNumber } from './calculator'

describe('parseNumber', () => {
  it('accepts finite numbers, including zero and decimals', () => {
    expect(parseNumber('0')).toBe(0)
    expect(parseNumber('-2.5')).toBe(-2.5)
  })

  it('rejects empty and non-finite input', () => {
    expect(parseNumber('')).toBeNull()
    expect(parseNumber('  ')).toBeNull()
    expect(parseNumber('1e999')).toBeNull()
  })
})

describe('formatResult', () => {
  it('formats ordinary and very small results clearly', () => {
    expect(formatResult(1234.5)).toBe('1,234.5')
    expect(formatResult(0.00000001)).toBe('1.00000000e-8')
  })
})

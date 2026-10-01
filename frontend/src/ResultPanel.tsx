import { formatResult, type Operation } from './calculator'

type ResultPanelProps = {
  operation: Operation
  first: string
  second: string
  result: number | null
  error: string
}

const symbols: Record<Operation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  sqrt: '√',
  percent: '% of',
}

export function ResultPanel({ operation, first, second, result, error }: ResultPanelProps) {
  const equation = operation === 'sqrt'
    ? '√(' + first + ')'
    : [first, symbols[operation], second].join(' ')

  return (
    <div className="result-panel" aria-live="polite" aria-atomic="true">
      <div className="result-label">
        <span>RESULT</span>
        <span aria-hidden="true">✦</span>
      </div>
      {error ? (
        <p className="error-message" role="alert">{error}</p>
      ) : result === null ? (
        <p className="result-placeholder">Your answer will appear here.</p>
      ) : (
        <>
          <div className="result-value">{formatResult(result)}</div>
          <p className="result-equation">{equation}</p>
        </>
      )}
    </div>
  )
}

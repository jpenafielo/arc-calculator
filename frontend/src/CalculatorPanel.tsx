import { operations } from './calculator'
import { ResultPanel } from './ResultPanel'
import { useCalculator } from './useCalculator'

export function CalculatorPanel() {
  const {
    operation,
    first,
    second,
    result,
    error,
    pending,
    unary,
    chooseOperation,
    changeFirst,
    changeSecond,
    handleSubmit,
    reset,
  } = useCalculator()

  return (
    <section className="calculator-card" aria-label="Calculator">
      <div className="card-heading">
        <div>
          <span className="section-number">01 / WORKSPACE</span>
          <h2>Calculate</h2>
        </div>
        <span className="card-accent" aria-hidden="true">✳</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="operation-fieldset">
          <legend>Choose an operation</legend>
          <div className="operation-grid">
            {operations.map(({ id, label, symbol }) => (
              <button
                key={id}
                type="button"
                className={operation === id ? 'operation active' : 'operation'}
                aria-pressed={operation === id}
                onClick={() => chooseOperation(id)}
                title={label}
                disabled={pending}
              >
                <span className="operation-symbol" aria-hidden="true">{symbol}</span>
                <span className="operation-label">{label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="input-heading">
          <span>YOUR NUMBERS</span>
          <span>02 / INPUT</span>
        </div>
        <div className="input-grid">
          <label className="number-field">
            <span>{operation === 'percent' ? 'Percentage' : 'First number'}</span>
            <input
              name="first"
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="0"
              value={first}
              onChange={(event) => changeFirst(event.target.value)}
              disabled={pending}
            />
          </label>
          {!unary && (
            <label className="number-field">
              <span>{operation === 'percent' ? 'Of number' : 'Second number'}</span>
              <input
                name="second"
                type="number"
                inputMode="decimal"
                step="any"
                placeholder="0"
                value={second}
                onChange={(event) => changeSecond(event.target.value)}
                disabled={pending}
              />
            </label>
          )}
        </div>

        <div className="actions">
          <button className="calculate-button" type="submit" disabled={pending}>
            {pending ? 'Calculating…' : 'Calculate'}
            <span aria-hidden="true">↗</span>
          </button>
          <button className="clear-button" type="button" onClick={reset} disabled={pending}>
            Clear all
          </button>
        </div>
      </form>

      <ResultPanel
        operation={operation}
        first={first}
        second={second}
        result={result}
        error={error}
      />
    </section>
  )
}

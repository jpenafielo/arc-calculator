import { useState, type FormEvent } from 'react'
import { calculate } from './api'
import { formatResult, operations, parseNumber, type Operation } from './calculator'

const symbols: Record<Operation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  sqrt: '√',
  percent: '% of',
}

function App() {
  const [operation, setOperation] = useState<Operation>('add')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const unary = operation === 'sqrt'

  function chooseOperation(next: Operation) {
    setOperation(next)
    setResult(null)
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const a = parseNumber(first)
    const b = unary ? undefined : parseNumber(second)
    if (a === null || (!unary && b === null)) {
      setResult(null)
      setError('Enter a valid number in each required field.')
      return
    }

    setPending(true)
    setError('')
    setResult(null)
    try {
      setResult(await calculate({ operation, a, ...(!unary && b !== null ? { b } : {}) }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The calculation could not be completed.')
    } finally {
      setPending(false)
    }
  }

  function reset() {
    setFirst('')
    setSecond('')
    setResult(null)
    setError('')
  }

  return (
    <main className="page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="shell">
        <header className="masthead">
          <div className="brand"><span className="brand-mark">∑</span><span>arc<span className="brand-dot">.</span></span></div>
          <span className="masthead-note">A little room for numbers</span>
        </header>

        <div className="content">
          <section className="intro" aria-labelledby="page-title">
            <div className="eyebrow"><span className="eyebrow-line" /> THE EVERYDAY CALCULATOR</div>
            <h1 id="page-title">Make sense<br /><em>of the math.</em></h1>
            <p>From the quick and simple to the slightly more curious. Choose an operation, enter your numbers, and get a clear answer.</p>
            <div className="intro-foot"><span className="sparkle">✳</span><span>Seven useful operations.<br />One simple place to work.</span></div>
          </section>

          <section className="calculator-card" aria-label="Calculator">
            <div className="card-heading">
              <div><span className="section-number">01 / WORKSPACE</span><h2>Calculate</h2></div>
              <span className="card-accent" aria-hidden="true">✳</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="operation-fieldset">
                <legend>Choose an operation</legend>
                <div className="operation-grid">
                  {operations.map(({ id, label, symbol }) => (
                    <button key={id} type="button" className={operation === id ? 'operation active' : 'operation'} aria-pressed={operation === id} onClick={() => chooseOperation(id)} title={label} disabled={pending}>
                      <span className="operation-symbol" aria-hidden="true">{symbol}</span><span className="operation-label">{label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="input-heading"><span>YOUR NUMBERS</span><span>02 / INPUT</span></div>
              <div className="input-grid">
                <label className="number-field">
                  <span>{operation === 'percent' ? 'Percentage' : 'First number'}</span>
                  <input name="first" type="number" inputMode="decimal" step="any" placeholder="0" value={first} onChange={(event) => { setFirst(event.target.value); setResult(null); setError('') }} disabled={pending} />
                </label>
                {!unary && <label className="number-field">
                  <span>{operation === 'percent' ? 'Of number' : 'Second number'}</span>
                  <input name="second" type="number" inputMode="decimal" step="any" placeholder="0" value={second} onChange={(event) => { setSecond(event.target.value); setResult(null); setError('') }} disabled={pending} />
                </label>}
              </div>

              <div className="actions">
                <button className="calculate-button" type="submit" disabled={pending}>{pending ? 'Calculating…' : 'Calculate'}<span aria-hidden="true">↗</span></button>
                <button className="clear-button" type="button" onClick={reset} disabled={pending}>Clear all</button>
              </div>
            </form>

            <div className="result-panel" aria-live="polite" aria-atomic="true">
              <div className="result-label"><span>RESULT</span><span aria-hidden="true">✦</span></div>
              {error ? <p className="error-message" role="alert">{error}</p> : result === null ? <p className="result-placeholder">Your answer will appear here.</p> : <><div className="result-value">{formatResult(result)}</div><p className="result-equation">{operation === 'sqrt' ? `√(${first})` : `${first} ${symbols[operation]} ${second}`}</p></>}
            </div>
          </section>
        </div>
        <footer className="footer"><span>ARC / 2026</span><span>Small calculations, clear thinking.</span></footer>
      </div>
    </main>
  )
}

export default App

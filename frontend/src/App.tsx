import { CalculatorPanel } from './CalculatorPanel'

function App() {
  return (
    <main className="page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="shell">
        <header className="masthead">
          <div className="brand">
            <span className="brand-mark">∑</span>
            <span>arc<span className="brand-dot">.</span></span>
          </div>
          <span className="masthead-note">A little room for numbers</span>
        </header>

        <div className="content">
          <section className="intro" aria-labelledby="page-title">
            <div className="eyebrow">
              <span className="eyebrow-line" /> THE EVERYDAY CALCULATOR
            </div>
            <h1 id="page-title">Make sense<br /><em>of the math.</em></h1>
            <p>
              From the quick and simple to the slightly more curious. Choose an
              operation, enter your numbers, and get a clear answer.
            </p>
            <div className="intro-foot">
              <span className="sparkle">✳</span>
              <span>Seven useful operations.<br />One simple place to work.</span>
            </div>
          </section>

          <CalculatorPanel />
        </div>

        <footer className="footer">
          <span>ARC / 2026</span>
          <span>Small calculations, clear thinking.</span>
        </footer>
      </div>
    </main>
  )
}

export default App

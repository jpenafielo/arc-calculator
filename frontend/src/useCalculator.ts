import { useState, type FormEvent } from 'react'
import { calculate, type Calculation } from './api'
import { parseNumber, type Operation } from './calculator'

export function useCalculator() {
  const [operation, setOperation] = useState<Operation>('add')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const unary = operation === 'sqrt'

  function clearOutcome() {
    setResult(null)
    setError('')
  }

  function chooseOperation(next: Operation) {
    setOperation(next)
    clearOutcome()
  }

  function changeFirst(value: string) {
    setFirst(value)
    clearOutcome()
  }

  function changeSecond(value: string) {
    setSecond(value)
    clearOutcome()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const a = parseNumber(first)
    const b = unary ? null : parseNumber(second)
    if (a === null || (!unary && b === null)) {
      setResult(null)
      setError('Enter a valid number in each required field.')
      return
    }

    const input: Calculation = { operation, a }
    if (b !== null) input.b = b

    setPending(true)
    clearOutcome()
    try {
      setResult(await calculate(input))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The calculation could not be completed.')
    } finally {
      setPending(false)
    }
  }

  function reset() {
    setFirst('')
    setSecond('')
    clearOutcome()
  }

  return {
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
  }
}

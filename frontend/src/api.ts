import type { Operation } from './calculator'

export type Calculation = {
  operation: Operation
  a: number
  b?: number
}

export async function calculate(input: Calculation): Promise<number> {
  let response: Response
  try {
    response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  } catch {
    throw new Error('Cannot reach the calculator service. Please try again.')
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('The server returned an invalid response.')
  }
  if (!response.ok) {
    if (typeof data === 'object' && data !== null && 'error' in data) {
      const error = data.error
      if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
        throw new Error(error.message)
      }
    }
    throw new Error('The calculation could not be completed.')
  }

  if (typeof data !== 'object' || data === null || !('result' in data) || typeof data.result !== 'number' || !Number.isFinite(data.result)) {
    throw new Error('The server returned an invalid result.')
  }
  return data.result
}

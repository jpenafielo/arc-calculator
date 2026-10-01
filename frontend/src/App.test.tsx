import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('calculator UI', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('sends inputs to the API and displays the result', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ result: 7 }),
    } as Response)
    render(<App />)

    await user.type(screen.getByLabelText('First number'), '5')
    await user.type(screen.getByLabelText('Second number'), '2')
    await user.click(screen.getByRole('button', { name: /calculate/i }))

    expect(fetch).toHaveBeenCalledWith('/api/calculate', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ operation: 'add', a: 5, b: 2 }),
    }))
    expect(await screen.findByText('7')).toBeInTheDocument()
  })

  it('validates required inputs before making a request', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /calculate/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid number')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('handles a unary operation and displays an API error', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: { code: 'negative_root', message: 'cannot take the square root of a negative number' } }),
    } as Response)
    render(<App />)

    await user.click(screen.getByRole('button', { name: /square root/i }))
    expect(screen.queryByLabelText('Second number')).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('First number'), '-4')
    await user.click(screen.getByRole('button', { name: /calculate/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('cannot take the square root')
    expect(fetch).toHaveBeenCalledWith('/api/calculate', expect.objectContaining({
      body: JSON.stringify({ operation: 'sqrt', a: -4 }),
    }))
  })

  it('shows a useful message when the service cannot be reached', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'))
    render(<App />)

    await user.type(screen.getByLabelText('First number'), '5')
    await user.type(screen.getByLabelText('Second number'), '2')
    await user.click(screen.getByRole('button', { name: /calculate/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the calculator service')
  })
})

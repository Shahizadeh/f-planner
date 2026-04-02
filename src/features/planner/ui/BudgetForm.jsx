import { useState } from 'react'
import { MONTHS } from '../model/constants'

function BudgetForm({ onSetBudget }) {
  const [month, setMonth] = useState(MONTHS[0])
  const [amount, setAmount] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      return
    }

    onSetBudget({ month, amount: parsedAmount })
    setAmount('')
  }

  return (
    <form className="planner-form" onSubmit={handleSubmit}>
      <h2>1) Initial Budget - Monthly</h2>
      <div className="planner-grid">
        <label>
          Month
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
            {MONTHS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Budget Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 2500"
            required
          />
        </label>
      </div>

      <button type="submit">Save Monthly Budget</button>
    </form>
  )
}

export default BudgetForm

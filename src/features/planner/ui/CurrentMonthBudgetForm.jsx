import { useState } from 'react'
import { formatCurrency } from '../model/formatters'

function CurrentMonthBudgetForm({
  monthName,
  currentBudget,
  defaultCurrency,
  onSetBudget,
}) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      return
    }

    onSetBudget({ month: monthName, amount: parsedAmount })
    setAmount('')
  }

  return (
    <form className="planner-form" onSubmit={handleSubmit}>
      <h2>Set Budget For Current Month</h2>
      <p className="muted">Month: {monthName}</p>
      <p className="muted">
        Current Budget: {formatCurrency(currentBudget, 0, defaultCurrency)}
      </p>

      <div className="planner-stack">
        <label>
          New Budget Amount
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

        <div className="form-actions">
          <button type="submit">Save Budget</button>
        </div>
      </div>
    </form>
  )
}

export default CurrentMonthBudgetForm

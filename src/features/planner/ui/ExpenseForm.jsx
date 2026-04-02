import { useState } from 'react'
import { MONTHS } from '../model/constants'

function ExpenseForm({ categories, onAddExpense }) {
  const [month, setMonth] = useState(MONTHS[0])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0] || '')
  const [newCategory, setNewCategory] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    const isAdded = onAddExpense({
      month,
      amount: parsedAmount,
      category,
      newCategory,
      note,
    })

    if (isAdded) {
      setAmount('')
      setNewCategory('')
      setNote('')
    }
  }

  return (
    <form className="planner-form" onSubmit={handleSubmit}>
      <h2>2) Add Expense</h2>
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
          Amount
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 45.90"
            required
          />
        </label>

        <label>
          Existing Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Or Create New Category
          <input
            type="text"
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="e.g. Entertainment"
          />
        </label>

        <label className="planner-grid-full">
          Note (optional)
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Gym subscription"
          />
        </label>
      </div>

      <button type="submit">Add Expense</button>
    </form>
  )
}

export default ExpenseForm

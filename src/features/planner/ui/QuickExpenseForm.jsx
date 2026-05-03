import { useMemo, useState } from 'react'
import { MONTHS } from '../model/constants'

function QuickExpenseForm({ monthName, categories, onAddExpense }) {
  const [amount, setAmount] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [note, setNote] = useState('')
  const [useCustomDateTime, setUseCustomDateTime] = useState(false)
  const [customDateTime, setCustomDateTime] = useState('')

  const normalizedInput = categoryInput.trim().toLowerCase()
  const filteredCategories = useMemo(() => {
    if (!normalizedInput) {
      return categories.slice(0, 6)
    }

    return categories
      .filter((item) => item.toLowerCase().includes(normalizedInput))
      .slice(0, 6)
  }, [categories, normalizedInput])

  const existingMatch = categories.find(
    (item) => item.toLowerCase() === normalizedInput,
  )

  const selectedCategoryTag = existingMatch || categoryInput.trim()

  const pickCategory = (value) => {
    setCategoryInput(value)
    setShowSuggestions(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    const trimmedCategory = categoryInput.trim()
    if (!trimmedCategory) {
      return
    }

    const matchedCategory = categories.find(
      (item) => item.toLowerCase() === trimmedCategory.toLowerCase(),
    )

    let expenseDate = new Date()
    if (useCustomDateTime) {
      const parsedCustomDate = new Date(customDateTime)
      if (!customDateTime || Number.isNaN(parsedCustomDate.valueOf())) {
        return
      }

      expenseDate = parsedCustomDate
    }

    const expenseMonth = MONTHS[expenseDate.getMonth()] || monthName

    const isAdded = onAddExpense({
      month: expenseMonth,
      amount: parsedAmount,
      category: matchedCategory || '',
      newCategory: matchedCategory ? '' : trimmedCategory,
      createdAt: expenseDate.toISOString(),
      note,
    })

    if (isAdded) {
      setAmount('')
      setCategoryInput('')
      setShowSuggestions(false)
      setNote('')
      setCustomDateTime('')
      setUseCustomDateTime(false)
    }
  }

  return (
    <form className="planner-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <p className="muted">Quick add for {monthName}</p>

      <div className="planner-grid">
        {useCustomDateTime ? (
          <label className="planner-grid-full">
            Expense Date & Time
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(event) => setCustomDateTime(event.target.value)}
              required
            />
          </label>
        ) : null}

        <label className="planner-grid-full">
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

        <label className="planner-grid-full category-field">
          Category Tag
          <input
            type="text"
            value={categoryInput}
            onChange={(event) => {
              setCategoryInput(event.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 120)
            }}
            placeholder="Type to search or create category"
            required
          />

          {selectedCategoryTag ? (
            <p className="tag-preview">Selected: {selectedCategoryTag}</p>
          ) : null}

          {showSuggestions && filteredCategories.length > 0 ? (
            <div className="tag-suggestions" role="listbox" aria-label="Categories">
              {filteredCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="tag-option"
                  onClick={() => pickCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </label>

        <label className="planner-grid-full">
          Note (optional)
          <div className="input-with-addon">
            <input
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. Coffee"
            />
            <button
              type="button"
              className="ghost small-action addon-action"
              onClick={() => setUseCustomDateTime((current) => !current)}
            >
              {useCustomDateTime ? 'Now' : 'Date/Time'}
            </button>
          </div>
        </label>
      </div>

      <button type="submit">Quick Add Expense</button>
    </form>
  )
}

export default QuickExpenseForm

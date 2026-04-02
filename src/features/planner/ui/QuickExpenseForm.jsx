import { useMemo, useState } from 'react'

function QuickExpenseForm({ monthName, categories, onAddExpense }) {
  const [amount, setAmount] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [note, setNote] = useState('')

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

    const isAdded = onAddExpense({
      month: monthName,
      amount: parsedAmount,
      category: matchedCategory || '',
      newCategory: matchedCategory ? '' : trimmedCategory,
      note,
    })

    if (isAdded) {
      setAmount('')
      setCategoryInput('')
      setShowSuggestions(false)
      setNote('')
    }
  }

  return (
    <form className="planner-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <p className="muted">Quick add for {monthName}</p>

      <div className="planner-grid">
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

        <label>
          Note (optional)
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Coffee"
          />
        </label>
      </div>

      <button type="submit">Quick Add Expense</button>
    </form>
  )
}

export default QuickExpenseForm

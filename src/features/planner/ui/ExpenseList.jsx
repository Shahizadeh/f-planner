import { formatCurrency } from '../model/formatters'

function ExpenseList({
  expenses,
  selectedDate,
  onChangeDate,
  defaultCurrency,
  onDeleteExpense,
}) {
  return (
    <section className="expenses-list">
      <div className="expenses-toolbar">
        <h2>Expenses</h2>
        <label className="date-filter">
          Date
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onChangeDate(event.target.value)}
          />
        </label>
      </div>
      {expenses.length === 0 ? (
        <p className="muted">No expenses found for the selected date.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <div className="expense-row-main">
                <span>
                  <strong>{expense.month}</strong> - {expense.category}
                </span>
                <span>{formatCurrency(expense.amount, 2, defaultCurrency)}</span>
              </div>
              {expense.note ? <small>{expense.note}</small> : null}
              <div className="expense-row-actions">
                <button
                  type="button"
                  className="ghost small-action"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ExpenseList

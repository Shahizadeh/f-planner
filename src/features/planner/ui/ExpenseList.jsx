import { formatCurrency } from '../model/formatters'

function ExpenseList({ expenses, defaultCurrency }) {
  return (
    <section className="expenses-list">
      <h2>Recent Expenses</h2>
      {expenses.length === 0 ? (
        <p className="muted">No expenses added yet.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <span>
                <strong>{expense.month}</strong> - {expense.category}
              </span>
              <span>{formatCurrency(expense.amount, 2, defaultCurrency)}</span>
              {expense.note ? <small>{expense.note}</small> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ExpenseList

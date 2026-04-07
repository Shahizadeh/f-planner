import { formatCurrency } from '../model/formatters'

function CategoryExpenseChart({ expenses, defaultCurrency }) {
  const grouped = expenses.reduce((accumulator, expense) => {
    const key = expense.category || 'Uncategorized'
    accumulator[key] = (accumulator[key] || 0) + expense.amount
    return accumulator
  }, {})

  const rows = Object.entries(grouped)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const maxTotal = rows.length > 0 ? rows[0].total : 1

  return (
    <section className="planner-chart">
      <h2>Current Month - Per Category</h2>
      {rows.length === 0 ? (
        <p className="muted">No expenses for this month yet.</p>
      ) : (
        <div className="chart-list" role="list">
          {rows.map((row) => (
            <article className="chart-row" key={row.category} role="listitem">
              <header>
                <h3>{row.category}</h3>
                <p className="muted">
                  {formatCurrency(row.total, 2, defaultCurrency)}
                </p>
              </header>
              <div className="bar bar-category" style={{ width: `${(row.total / maxTotal) * 100}%` }}>
                <span>{formatCurrency(row.total, 2, defaultCurrency)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default CategoryExpenseChart

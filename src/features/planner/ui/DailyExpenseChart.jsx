import { formatCurrency } from '../model/formatters'

function getExpenseDate(expense) {
  if (typeof expense.createdAt === 'string') {
    const createdAtDate = new Date(expense.createdAt)
    if (!Number.isNaN(createdAtDate.valueOf())) {
      return createdAtDate
    }
  }

  if (typeof expense.id === 'string') {
    const [firstToken] = expense.id.split('-')
    const timestamp = Number(firstToken)
    if (Number.isFinite(timestamp) && timestamp > 0) {
      const idDate = new Date(timestamp)
      if (!Number.isNaN(idDate.valueOf())) {
        return idDate
      }
    }
  }

  return null
}

function DailyExpenseChart({ expenses, defaultCurrency }) {
  const grouped = expenses.reduce((accumulator, expense) => {
    const date = getExpenseDate(expense)
    if (!date) {
      return accumulator
    }

    const day = date.getDate()
    accumulator[day] = (accumulator[day] || 0) + expense.amount
    return accumulator
  }, {})

  const rows = Object.entries(grouped)
    .map(([day, total]) => ({ day: Number(day), total }))
    .sort((a, b) => a.day - b.day)

  const maxTotal = rows.reduce((max, row) => Math.max(max, row.total), 1)

  return (
    <section className="planner-chart">
      <h2>Current Month - Per Day</h2>
      {rows.length === 0 ? (
        <p className="muted">No dated expenses available for this month yet.</p>
      ) : (
        <div className="chart-list" role="list">
          {rows.map((row) => (
            <article className="chart-row" key={row.day} role="listitem">
              <header>
                <h3>Day {row.day}</h3>
                <p className="muted">
                  {formatCurrency(row.total, 2, defaultCurrency)}
                </p>
              </header>
              <div className="bar bar-day" style={{ width: `${(row.total / maxTotal) * 100}%` }}>
                <span>{formatCurrency(row.total, 2, defaultCurrency)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default DailyExpenseChart

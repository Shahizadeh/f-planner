function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function MonthlyStatusChart({ monthlySummary }) {
  return (
    <section className="planner-chart">
      <h2>3) Monthly Budget vs Expenses Status</h2>

      <div className="chart-list" role="list">
        {monthlySummary.map((item) => {
          const budgetWidth = item.budget > 0 ? 100 : 0
          const spentWidth =
            item.budget > 0
              ? Math.min((item.spent / item.budget) * 100, 100)
              : item.spent > 0
                ? 100
                : 0

          return (
            <article className="chart-row" key={item.month} role="listitem">
              <header>
                <h3>{item.month}</h3>
                <p className={`status-pill ${item.remaining < 0 ? 'danger' : 'safe'}`}>
                  {item.status}
                </p>
              </header>

              <div className="bars">
                <div className="bar bar-budget" style={{ width: `${budgetWidth}%` }}>
                  <span>Budget {formatCurrency(item.budget)}</span>
                </div>
                <div className="bar bar-expense" style={{ width: `${spentWidth}%` }}>
                  <span>Expenses {formatCurrency(item.spent)}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default MonthlyStatusChart

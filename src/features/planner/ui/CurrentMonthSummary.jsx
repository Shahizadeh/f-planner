import { formatCurrency } from '../model/formatters'

function CurrentMonthSummary({ summary, defaultCurrency }) {
  const maxValue = Math.max(summary.budget, summary.spent, 1)
  const budgetWidth = (summary.budget / maxValue) * 100
  const spentWidth = (summary.spent / maxValue) * 100

  return (
    <section className="planner-chart">
      <h2>{summary.month} Overview</h2>
      <p className={`status-pill ${summary.remaining < 0 ? 'danger' : 'safe'}`}>
        {summary.status}
      </p>

      <div className="bars compact">
        <div className="bar bar-budget" style={{ width: `${budgetWidth}%` }}>
          <span>Budget {formatCurrency(summary.budget, 0, defaultCurrency)}</span>
        </div>
        <div className="bar bar-expense" style={{ width: `${spentWidth}%` }}>
          <span>Expenses {formatCurrency(summary.spent, 0, defaultCurrency)}</span>
        </div>
      </div>

      <p className="muted">
        Remaining: {formatCurrency(summary.remaining, 0, defaultCurrency)}
      </p>
    </section>
  )
}

export default CurrentMonthSummary

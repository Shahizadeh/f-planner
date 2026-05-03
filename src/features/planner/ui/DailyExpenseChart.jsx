import { formatCurrency } from '../model/formatters'
import { Bar } from './chartSetup'

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

  const data = {
    labels: rows.map((row) => `Day ${row.day}`),
    datasets: [
      {
        label: 'Expenses by Day',
        data: rows.map((row) => row.total),
        borderRadius: 8,
        backgroundColor: 'rgba(245, 158, 11, 0.45)',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.parsed.y, 2, defaultCurrency),
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value, 0, defaultCurrency),
        },
      },
    },
  }

  return (
    <section className="planner-chart">
      <h2>Current Month - Per Day</h2>
      {rows.length === 0 ? (
        <p className="muted">No dated expenses available for this month yet.</p>
      ) : (
        <div className="chart-canvas chart-canvas-md">
          <Bar data={data} options={options} />
        </div>
      )}
    </section>
  )
}

export default DailyExpenseChart

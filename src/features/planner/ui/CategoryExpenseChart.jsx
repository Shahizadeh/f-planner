import { formatCurrency } from '../model/formatters'
import { Bar } from './chartSetup'

function CategoryExpenseChart({ expenses, defaultCurrency }) {
  const grouped = expenses.reduce((accumulator, expense) => {
    const key = expense.category || 'Uncategorized'
    accumulator[key] = (accumulator[key] || 0) + expense.amount
    return accumulator
  }, {})

  const rows = Object.entries(grouped)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const data = {
    labels: rows.map((row) => row.category),
    datasets: [
      {
        label: 'Expenses by Category',
        data: rows.map((row) => row.total),
        borderRadius: 8,
        backgroundColor: 'rgba(20, 184, 166, 0.45)',
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
          maxRotation: 0,
          minRotation: 0,
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
      <h2>Current Month - Per Category</h2>
      {rows.length === 0 ? (
        <p className="muted">No expenses for this month yet.</p>
      ) : (
        <div className="chart-canvas chart-canvas-md">
          <Bar data={data} options={options} />
        </div>
      )}
    </section>
  )
}

export default CategoryExpenseChart

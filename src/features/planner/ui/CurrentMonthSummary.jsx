import { formatCurrency } from '../model/formatters'
import { Bar } from './chartSetup'

function CurrentMonthSummary({ summary, defaultCurrency }) {
  const data = {
    labels: ['Budget', 'Expenses'],
    datasets: [
      {
        label: summary.month,
        data: [summary.budget, summary.spent],
        borderRadius: 8,
        backgroundColor: ['rgba(37, 99, 235, 0.45)', 'rgba(239, 68, 68, 0.45)'],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.parsed.x, 2, defaultCurrency),
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => formatCurrency(value, 0, defaultCurrency),
        },
      },
    },
  }

  return (
    <section className="planner-chart">
      <h2>{summary.month} Overview</h2>
      <p className={`status-pill ${summary.remaining < 0 ? 'danger' : 'safe'}`}>
        {summary.status}
      </p>

      <div className="chart-canvas chart-canvas-sm">
        <Bar data={data} options={options} />
      </div>

      <p className="muted">
        Remaining: {formatCurrency(summary.remaining, 0, defaultCurrency)}
      </p>
    </section>
  )
}

export default CurrentMonthSummary

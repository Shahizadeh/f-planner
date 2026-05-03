import { toShortMonth } from '../model/constants'
import { Bar } from './chartSetup'

function PastMonthsMiniChart({ rows }) {
  const data = {
    labels: rows.map((row) => toShortMonth(row.month)),
    datasets: [
      {
        label: 'Expenses',
        data: rows.map((row) => row.spent),
        borderRadius: 8,
        backgroundColor: 'rgba(37, 99, 235, 0.45)',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <section className="planner-chart">
      <h2>Past Months Snapshot</h2>
      <div className="chart-canvas chart-canvas-sm">
        <Bar data={data} options={options} />
      </div>
    </section>
  )
}

export default PastMonthsMiniChart

import { toShortMonth } from '../model/constants'

function PastMonthsMiniChart({ rows }) {
  return (
    <section className="planner-chart">
      <h2>Past Months Snapshot</h2>
      <div className="mini-chart" role="list">
        {rows.map((row) => {
          const limit = row.budget > 0 ? row.budget : Math.max(row.spent, 1)
          const ratio = Math.min(row.spent / limit, 1)

          return (
            <article key={row.month} className="mini-item" role="listitem">
              <span>{toShortMonth(row.month)}</span>
              <div className="mini-track" aria-hidden="true">
                <div className="mini-fill" style={{ height: `${Math.max(ratio * 100, 6)}%` }} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default PastMonthsMiniChart

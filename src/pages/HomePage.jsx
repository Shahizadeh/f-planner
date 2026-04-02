import FinancialPlannerDashboard from '../features/planner/ui/FinancialPlannerDashboard'

function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="hero-tag">FPlanner</p>
        <h1>Financial Planner</h1>
        <p className="hero-copy">
          Plan monthly budgets, add expenses with dynamic categories, and track
          each month status with a simple chart.
        </p>
      </section>

      <FinancialPlannerDashboard />
    </main>
  )
}

export default HomePage

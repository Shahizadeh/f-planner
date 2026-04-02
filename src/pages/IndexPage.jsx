import CurrentMonthSummary from '../features/planner/ui/CurrentMonthSummary'
import PastMonthsMiniChart from '../features/planner/ui/PastMonthsMiniChart'

function IndexPage({ currentSummary, pastMonths, defaultCurrency }) {
  return (
    <section className="planner-layout">
      <CurrentMonthSummary
        summary={currentSummary}
        defaultCurrency={defaultCurrency}
      />
      <PastMonthsMiniChart rows={pastMonths} />
    </section>
  )
}

export default IndexPage

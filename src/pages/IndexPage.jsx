import CurrentMonthSummary from '../features/planner/ui/CurrentMonthSummary'
import PastMonthsMiniChart from '../features/planner/ui/PastMonthsMiniChart'
import CategoryExpenseChart from '../features/planner/ui/CategoryExpenseChart'
import DailyExpenseChart from '../features/planner/ui/DailyExpenseChart'

function IndexPage({
  currentSummary,
  pastMonths,
  currentMonthName,
  expenses,
  defaultCurrency,
}) {
  const currentMonthExpenses = expenses.filter(
    (expense) => expense.month === currentMonthName,
  )

  return (
    <section className="planner-layout">
      <CurrentMonthSummary
        summary={currentSummary}
        defaultCurrency={defaultCurrency}
      />
      <PastMonthsMiniChart rows={pastMonths} />
      <CategoryExpenseChart
        expenses={currentMonthExpenses}
        defaultCurrency={defaultCurrency}
      />
      <DailyExpenseChart
        expenses={currentMonthExpenses}
        defaultCurrency={defaultCurrency}
      />
    </section>
  )
}

export default IndexPage

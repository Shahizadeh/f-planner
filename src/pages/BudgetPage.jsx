import CurrentMonthBudgetForm from '../features/planner/ui/CurrentMonthBudgetForm'
import DefaultCurrencySection from '../features/planner/ui/DefaultCurrencySection'

function BudgetPage({
  monthName,
  currentBudget,
  defaultCurrency,
  onSetBudget,
  onChangeCurrency,
}) {
  return (
    <section className="planner-layout">
      <CurrentMonthBudgetForm
        monthName={monthName}
        currentBudget={currentBudget}
        defaultCurrency={defaultCurrency}
        onSetBudget={onSetBudget}
      />
      <DefaultCurrencySection
        defaultCurrency={defaultCurrency}
        onChangeCurrency={onChangeCurrency}
      />
    </section>
  )
}

export default BudgetPage

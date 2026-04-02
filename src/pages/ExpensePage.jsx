import QuickExpenseForm from '../features/planner/ui/QuickExpenseForm'
import ExpenseList from '../features/planner/ui/ExpenseList'

function ExpensePage({
  monthName,
  categories,
  expenses,
  defaultCurrency,
  onAddExpense,
}) {
  return (
    <section className="planner-layout">
      <QuickExpenseForm
        monthName={monthName}
        categories={categories}
        onAddExpense={onAddExpense}
      />
      <ExpenseList expenses={expenses} defaultCurrency={defaultCurrency} />
    </section>
  )
}

export default ExpensePage

import BudgetForm from './BudgetForm'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import MonthlyStatusChart from './MonthlyStatusChart'
import { useFinancialPlanner } from '../model/useFinancialPlanner'

function FinancialPlannerDashboard() {
  const {
    categories,
    expenses,
    monthlySummary,
    setBudget,
    addExpense,
    isHydrated,
  } = useFinancialPlanner()

  return (
    <section className="planner-layout">
      {!isHydrated ? <p className="muted">Loading your planner...</p> : null}
      <BudgetForm onSetBudget={setBudget} />
      <ExpenseForm categories={categories} onAddExpense={addExpense} />
      <MonthlyStatusChart monthlySummary={monthlySummary} />
      <ExpenseList expenses={expenses} />
    </section>
  )
}

export default FinancialPlannerDashboard

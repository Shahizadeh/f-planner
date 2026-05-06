import { useMemo, useState } from 'react'
import QuickExpenseForm from '../features/planner/ui/QuickExpenseForm'
import ExpenseList from '../features/planner/ui/ExpenseList'

function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getExpenseDate(expense) {
  if (typeof expense.createdAt === 'string') {
    const createdAtDate = new Date(expense.createdAt)
    if (!Number.isNaN(createdAtDate.valueOf())) {
      return createdAtDate
    }
  }

  if (typeof expense.id === 'string') {
    const [firstToken] = expense.id.split('-')
    const timestamp = Number(firstToken)
    if (Number.isFinite(timestamp) && timestamp > 0) {
      const idDate = new Date(timestamp)
      if (!Number.isNaN(idDate.valueOf())) {
        return idDate
      }
    }
  }

  return null
}

function ExpensePage({
  monthName,
  categories,
  expenses,
  defaultCurrency,
  onAddExpense,
  onDeleteExpense,
}) {
  const [selectedDate, setSelectedDate] = useState(() =>
    toDateInputValue(new Date()),
  )

  const visibleExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const date = getExpenseDate(expense)
      if (!date) {
        return false
      }

      return toDateInputValue(date) === selectedDate
    })
  }, [expenses, selectedDate])

  return (
    <section className="planner-layout">
      <QuickExpenseForm
        monthName={monthName}
        categories={categories}
        onAddExpense={onAddExpense}
      />
      <ExpenseList
        expenses={visibleExpenses}
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        defaultCurrency={defaultCurrency}
        onDeleteExpense={onDeleteExpense}
      />
    </section>
  )
}

export default ExpensePage

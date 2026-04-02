import { useEffect, useMemo, useState } from 'react'
import BottomNav from './layout/BottomNav'
import LoadingScreen from './layout/LoadingScreen'
import ThemeToggle from './layout/ThemeToggle'
import { getCurrentMonthName, MONTHS } from '../features/planner/model/constants'
import { useFinancialPlanner } from '../features/planner/model/useFinancialPlanner'
import IndexPage from '../pages/IndexPage'
import BudgetPage from '../pages/BudgetPage'
import ExpensePage from '../pages/ExpensePage'

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedTheme = window.localStorage.getItem('fplanner-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function App() {
  const [activePage, setActivePage] = useState('index')
  const [theme, setTheme] = useState(getInitialTheme)
  const {
    categories,
    expenses,
    monthlySummary,
    defaultCurrency,
    setBudget,
    setDefaultCurrency,
    addExpense,
    isHydrated,
  } = useFinancialPlanner()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('fplanner-theme', theme)
  }, [theme])

  const currentMonthName = getCurrentMonthName()
  const currentSummary =
    monthlySummary.find((item) => item.month === currentMonthName) || monthlySummary[0]

  const pastMonths = useMemo(() => {
    const currentIndex = MONTHS.indexOf(currentMonthName)
    const rows = []

    for (let offset = 1; offset <= 6; offset += 1) {
      const month = MONTHS[(currentIndex - offset + 12) % 12]
      const summary = monthlySummary.find((item) => item.month === month)
      if (summary) {
        rows.unshift(summary)
      }
    }

    return rows
  }, [currentMonthName, monthlySummary])

  let content = null

  if (!isHydrated) {
    content = <LoadingScreen />
  } else if (activePage === 'budget') {
    content = (
      <BudgetPage
        monthName={currentMonthName}
        currentBudget={currentSummary.budget}
        defaultCurrency={defaultCurrency}
        onSetBudget={setBudget}
        onChangeCurrency={setDefaultCurrency}
      />
    )
  } else if (activePage === 'expense') {
    content = (
      <ExpensePage
        monthName={currentMonthName}
        categories={categories}
        expenses={expenses}
        defaultCurrency={defaultCurrency}
        onAddExpense={addExpense}
      />
    )
  } else {
    content = (
      <IndexPage
        currentSummary={currentSummary}
        pastMonths={pastMonths}
        defaultCurrency={defaultCurrency}
      />
    )
  }

  return (
    <main className="page-shell app-shell">
      <section className="hero">
        <div className="hero-top">
          <div>
            <p className="hero-tag">FPlanner</p>
            <h1>Financial Planner</h1>
          </div>
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          />
        </div>
      </section>

      {content}
      <BottomNav activePage={activePage} onChangePage={setActivePage} />
    </main>
  )
}

export default App

import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CATEGORIES, MONTHS, SUPPORTED_CURRENCIES } from './constants'
import { loadPlannerState, savePlannerState } from './storage'

function getInitialBudgetState() {
  return MONTHS.reduce((accumulator, month) => {
    accumulator[month] = 0
    return accumulator
  }, {})
}

function getExpenseId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useFinancialPlanner() {
  const [budgetsByMonth, setBudgetsByMonth] = useState(getInitialBudgetState)
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [defaultCurrency, setDefaultCurrency] = useState('USD')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let isMounted = true

    loadPlannerState()
      .then((savedState) => {
        if (!isMounted || !savedState) {
          return
        }

        if (savedState.budgetsByMonth) {
          setBudgetsByMonth((current) => ({
            ...current,
            ...savedState.budgetsByMonth,
          }))
        }

        if (Array.isArray(savedState.expenses)) {
          setExpenses(savedState.expenses)
        }

        if (Array.isArray(savedState.categories) && savedState.categories.length > 0) {
          setCategories(savedState.categories)
        }

        if (
          typeof savedState.defaultCurrency === 'string' &&
          SUPPORTED_CURRENCIES.includes(savedState.defaultCurrency)
        ) {
          setDefaultCurrency(savedState.defaultCurrency)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHydrated(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    savePlannerState({
      budgetsByMonth,
      expenses,
      categories,
      defaultCurrency,
    }).catch(() => {
      // Keep UX uninterrupted if persistence fails.
    })
  }, [budgetsByMonth, expenses, categories, defaultCurrency, isHydrated])

  const setBudget = ({ month, amount }) => {
    setBudgetsByMonth((current) => ({
      ...current,
      [month]: amount,
    }))
  }

  const addExpense = ({ month, amount, category, newCategory, note }) => {
    const trimmedCategory = newCategory.trim()
    const selectedCategory = trimmedCategory || category

    if (!selectedCategory) {
      return false
    }

    if (trimmedCategory) {
      setCategories((current) => {
        const exists = current.some(
          (item) => item.toLowerCase() === trimmedCategory.toLowerCase(),
        )

        if (exists) {
          return current
        }

        return [...current, trimmedCategory]
      })
    }

    setExpenses((current) => [
      {
        id: getExpenseId(),
        month,
        amount,
        category: selectedCategory,
        note: note.trim(),
      },
      ...current,
    ])

    return true
  }

  const monthlySummary = useMemo(
    () =>
      MONTHS.map((month) => {
        const budget = budgetsByMonth[month] || 0
        const spent = expenses
          .filter((expense) => expense.month === month)
          .reduce((sum, expense) => sum + expense.amount, 0)

        const remaining = budget - spent

        return {
          month,
          budget,
          spent,
          remaining,
          status:
            budget <= 0
              ? 'No budget set'
              : remaining >= 0
                ? 'On track'
                : 'Over budget',
        }
      }),
    [budgetsByMonth, expenses],
  )

  return {
    budgetsByMonth,
    expenses,
    categories,
    defaultCurrency,
    isHydrated,
    monthlySummary,
    setBudget,
    setDefaultCurrency,
    addExpense,
  }
}

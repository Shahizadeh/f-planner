import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CATEGORIES, MONTHS, SUPPORTED_CURRENCIES } from './constants'
import {
  ensureCategory,
  loadPlannerState,
  saveDefaultCurrency,
  saveExpense,
  saveMonthlyBudget,
} from './storage'

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
  const [defaultCurrency, setDefaultCurrencyState] = useState('USD')
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
          setDefaultCurrencyState(savedState.defaultCurrency)
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

  const setBudget = ({ month, amount }) => {
    setBudgetsByMonth((current) => ({
      ...current,
      [month]: amount,
    }))

    saveMonthlyBudget(month, amount).catch(() => {
      // Keep UX uninterrupted if persistence fails.
    })
  }

  const setDefaultCurrency = (nextCurrency) => {
    if (!SUPPORTED_CURRENCIES.includes(nextCurrency)) {
      return
    }

    setDefaultCurrencyState(nextCurrency)
    saveDefaultCurrency(nextCurrency).catch(() => {
      // Keep UX uninterrupted if persistence fails.
    })
  }

  const addExpense = ({ month, amount, category, newCategory, note, createdAt }) => {
    const trimmedCategory = newCategory.trim()
    const selectedCategory = trimmedCategory || category

    let normalizedCreatedAt = new Date().toISOString()
    if (typeof createdAt === 'string') {
      const parsedDate = new Date(createdAt)
      if (!Number.isNaN(parsedDate.valueOf())) {
        normalizedCreatedAt = parsedDate.toISOString()
      }
    }

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

        ensureCategory(trimmedCategory).catch(() => {
          // Keep UX uninterrupted if persistence fails.
        })

        return [...current, trimmedCategory]
      })
    }

    const expenseRecord = {
      id: getExpenseId(),
      createdAt: normalizedCreatedAt,
      month,
      amount,
      category: selectedCategory,
      note: note.trim(),
    }

    setExpenses((current) => [expenseRecord, ...current])

    saveExpense(expenseRecord).catch(() => {
      // Keep UX uninterrupted if persistence fails.
    })

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

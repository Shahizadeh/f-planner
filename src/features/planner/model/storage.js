const DB_NAME = 'fplanner-db'
const DB_VERSION = 2

const LEGACY_STORE = 'app-state'
const LEGACY_STATE_KEY = 'planner-state-v1'

const BUDGETS_STORE = 'budgets'
const EXPENSES_STORE = 'expenses'
const CATEGORIES_STORE = 'categories'
const SETTINGS_STORE = 'settings'
const META_STORE = 'meta'

const MIGRATION_META_KEY = 'legacyMigratedToV2'
const SETTING_DEFAULT_CURRENCY_KEY = 'defaultCurrency'

function createIdFallback() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(LEGACY_STORE)) {
        database.createObjectStore(LEGACY_STORE)
      }

      if (!database.objectStoreNames.contains(BUDGETS_STORE)) {
        database.createObjectStore(BUDGETS_STORE, { keyPath: 'month' })
      }

      if (!database.objectStoreNames.contains(EXPENSES_STORE)) {
        database.createObjectStore(EXPENSES_STORE, { keyPath: 'id' })
      }

      if (!database.objectStoreNames.contains(CATEGORIES_STORE)) {
        database.createObjectStore(CATEGORIES_STORE, { keyPath: 'name' })
      }

      if (!database.objectStoreNames.contains(SETTINGS_STORE)) {
        database.createObjectStore(SETTINGS_STORE, { keyPath: 'key' })
      }

      if (!database.objectStoreNames.contains(META_STORE)) {
        database.createObjectStore(META_STORE, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function getRecord(database, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

function getAllRecords(database, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result ?? [])
    request.onerror = () => reject(request.error)
  })
}

function runWriteTransaction(database, storeNames, onTransaction) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeNames, 'readwrite')

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)

    onTransaction(transaction)
  })
}

function normalizeExpense(expense) {
  const id =
    typeof expense.id === 'string' && expense.id.trim().length > 0
      ? expense.id
      : createIdFallback()

  const createdAtDate = new Date(expense.createdAt)

  return {
    id,
    createdAt: Number.isNaN(createdAtDate.valueOf())
      ? new Date().toISOString()
      : createdAtDate.toISOString(),
    month: expense.month,
    amount: Number(expense.amount) || 0,
    category: expense.category || 'Uncategorized',
    note: typeof expense.note === 'string' ? expense.note : '',
  }
}

async function migrateLegacyStateIfNeeded(database) {
  const migrationMeta = await getRecord(database, META_STORE, MIGRATION_META_KEY)
  if (migrationMeta?.value === true) {
    return
  }

  const legacyState = database.objectStoreNames.contains(LEGACY_STORE)
    ? await getRecord(database, LEGACY_STORE, LEGACY_STATE_KEY)
    : null

  await runWriteTransaction(
    database,
    [BUDGETS_STORE, EXPENSES_STORE, CATEGORIES_STORE, SETTINGS_STORE, META_STORE],
    (transaction) => {
      const budgetsStore = transaction.objectStore(BUDGETS_STORE)
      const expensesStore = transaction.objectStore(EXPENSES_STORE)
      const categoriesStore = transaction.objectStore(CATEGORIES_STORE)
      const settingsStore = transaction.objectStore(SETTINGS_STORE)
      const metaStore = transaction.objectStore(META_STORE)

      if (legacyState?.budgetsByMonth && typeof legacyState.budgetsByMonth === 'object') {
        Object.entries(legacyState.budgetsByMonth).forEach(([month, amount]) => {
          budgetsStore.put({ month, amount: Number(amount) || 0 })
        })
      }

      if (Array.isArray(legacyState?.expenses)) {
        legacyState.expenses.forEach((expense) => {
          expensesStore.put(normalizeExpense(expense))
        })
      }

      if (Array.isArray(legacyState?.categories)) {
        legacyState.categories
          .filter((category) => typeof category === 'string' && category.trim().length > 0)
          .forEach((category) => {
            categoriesStore.put({ name: category.trim() })
          })
      }

      if (typeof legacyState?.defaultCurrency === 'string') {
        settingsStore.put({
          key: SETTING_DEFAULT_CURRENCY_KEY,
          value: legacyState.defaultCurrency,
        })
      }

      metaStore.put({ key: MIGRATION_META_KEY, value: true })
    },
  )
}

async function withDatabase(runOperation) {
  const database = await openDb()
  if (!database) {
    return null
  }

  try {
    await migrateLegacyStateIfNeeded(database)
    return await runOperation(database)
  } finally {
    database.close()
  }
}

export async function loadPlannerState() {
  const state = await withDatabase(async (database) => {
    const [budgetRows, expenseRows, categoryRows, defaultCurrencySetting] = await Promise.all([
      getAllRecords(database, BUDGETS_STORE),
      getAllRecords(database, EXPENSES_STORE),
      getAllRecords(database, CATEGORIES_STORE),
      getRecord(database, SETTINGS_STORE, SETTING_DEFAULT_CURRENCY_KEY),
    ])

    const budgetsByMonth = budgetRows.reduce((accumulator, row) => {
      accumulator[row.month] = Number(row.amount) || 0
      return accumulator
    }, {})

    const expenses = expenseRows
      .map((expense) => normalizeExpense(expense))
      .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())

    const categories = categoryRows
      .map((row) => row.name)
      .filter((name) => typeof name === 'string' && name.trim().length > 0)

    return {
      budgetsByMonth,
      expenses,
      categories,
      defaultCurrency: defaultCurrencySetting?.value,
    }
  })

  return state
}

export async function saveMonthlyBudget(month, amount) {
  await withDatabase((database) =>
    runWriteTransaction(database, [BUDGETS_STORE], (transaction) => {
      transaction.objectStore(BUDGETS_STORE).put({ month, amount })
    }),
  )
}

export async function saveDefaultCurrency(defaultCurrency) {
  await withDatabase((database) =>
    runWriteTransaction(database, [SETTINGS_STORE], (transaction) => {
      transaction.objectStore(SETTINGS_STORE).put({
        key: SETTING_DEFAULT_CURRENCY_KEY,
        value: defaultCurrency,
      })
    }),
  )
}

export async function ensureCategory(category) {
  const trimmedCategory = category.trim()
  if (!trimmedCategory) {
    return
  }

  await withDatabase((database) =>
    runWriteTransaction(database, [CATEGORIES_STORE], (transaction) => {
      transaction.objectStore(CATEGORIES_STORE).put({ name: trimmedCategory })
    }),
  )
}

export async function saveExpense(expense) {
  await withDatabase((database) =>
    runWriteTransaction(database, [EXPENSES_STORE], (transaction) => {
      transaction.objectStore(EXPENSES_STORE).put(normalizeExpense(expense))
    }),
  )
}

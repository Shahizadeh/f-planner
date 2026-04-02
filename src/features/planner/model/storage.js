const DB_NAME = 'fplanner-db'
const DB_VERSION = 1
const STORE_NAME = 'app-state'
const STATE_KEY = 'planner-state-v1'

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function getFromDb(database, key) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

function putToDb(database, key, value) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(value, key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function loadPlannerState() {
  const database = await openDb()
  if (!database) {
    return null
  }

  try {
    return await getFromDb(database, STATE_KEY)
  } finally {
    database.close()
  }
}

export async function savePlannerState(state) {
  const database = await openDb()
  if (!database) {
    return
  }

  try {
    await putToDb(database, STATE_KEY, state)
  } finally {
    database.close()
  }
}

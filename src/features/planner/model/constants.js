export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const DEFAULT_CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Health',
]

export const SUPPORTED_CURRENCIES = [
  'AFN',
  'USD',
  'EUR',
  'GBP',
  'AED',
  'SAR',
  'EGP',
  'INR',
]

export function getCurrentMonthName() {
  return MONTHS[new Date().getMonth()]
}

export function toShortMonth(month) {
  return month.slice(0, 3)
}

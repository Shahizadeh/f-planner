export function formatCurrency(value, maxFractionDigits = 0, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: maxFractionDigits,
  }).format(value)
}

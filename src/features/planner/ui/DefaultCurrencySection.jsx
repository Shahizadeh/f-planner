import { SUPPORTED_CURRENCIES } from '../model/constants'

function DefaultCurrencySection({ defaultCurrency, onChangeCurrency }) {
  return (
    <section className="planner-form">
      <h2>Default Currency Used</h2>
      <label>
        Currency
        <select
          value={defaultCurrency}
          onChange={(event) => onChangeCurrency(event.target.value)}
        >
          {SUPPORTED_CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}

export default DefaultCurrencySection

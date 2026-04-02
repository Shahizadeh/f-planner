import { SUPPORTED_CURRENCIES } from '../model/constants'

function DefaultCurrencySection({ defaultCurrency, onChangeCurrency }) {
  return (
    <section className="planner-form">
      <h2>Default Currency Used</h2>
      <div className="planner-stack currency-field-wrap">
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
      </div>
    </section>
  )
}

export default DefaultCurrencySection

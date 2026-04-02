import { useCounter } from '../model/useCounter'
import Card from '../../../shared/ui/Card'

function CounterPanel() {
  const { count, increment, reset } = useCounter(0)

  return (
    <Card title="Counter Feature">
      <p className="counter-value">Current value: {count}</p>
      <div className="counter-actions">
        <button type="button" onClick={increment}>
          Increment
        </button>
        <button type="button" className="ghost" onClick={reset}>
          Reset
        </button>
      </div>
    </Card>
  )
}

export default CounterPanel

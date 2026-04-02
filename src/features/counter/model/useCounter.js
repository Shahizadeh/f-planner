import { useState } from 'react'

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount((current) => current + 1)
  const reset = () => setCount(initialValue)

  return {
    count,
    increment,
    reset,
  }
}

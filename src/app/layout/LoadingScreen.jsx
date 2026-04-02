function LoadingScreen() {
  return (
    <section className="loading-screen" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Loading your planner...</p>
    </section>
  )
}

export default LoadingScreen

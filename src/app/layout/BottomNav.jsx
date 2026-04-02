const NAV_ITEMS = [
  {
    key: 'index',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    key: 'budget',
    label: 'Budget',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3H4zm0 5h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm11 3h3v2h-3z" />
      </svg>
    ),
  },
  {
    key: 'expense',
    label: 'Expense',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5h2v14h-2z" />
        <path d="M5 11h14v2H5z" />
      </svg>
    ),
  },
]

function BottomNav({ activePage, onChangePage }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`nav-item ${activePage === item.key ? 'active' : ''}`}
          onClick={() => onChangePage(item.key)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav

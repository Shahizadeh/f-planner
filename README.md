# FPlanner

FPlanner is a fully client-side Financial Planner built with React + Vite and PWA support.

The app is offline-first and stores all planner data in IndexedDB. No backend and no API calls are used.

## Features

- Monthly budget setup for the current month.
- Quick expense addition for the current month.
- Dynamic expense categories (create custom categories on the fly).
- Index dashboard with:
	- Current month budget vs expenses status.
	- Mini bar chart showing recent past months.
- Bottom navigation with icons for:
	- Home (Index)
	- Budget
	- Expense
- Installable PWA with offline usage support.

## Tech Stack

- React 19
- Vite 8
- vite-plugin-pwa
- IndexedDB (browser storage)
- ESLint 9 (flat config)

## Project Structure

```
src/
	app/
		App.jsx
		layout/
			BottomNav.jsx
			LoadingScreen.jsx
		providers/
			pwa.js
		styles/
			index.css
	features/
		planner/
			model/
				constants.js
				formatters.js
				storage.js
				useFinancialPlanner.js
			ui/
				CurrentMonthSummary.jsx
				PastMonthsMiniChart.jsx
				CurrentMonthBudgetForm.jsx
				QuickExpenseForm.jsx
				ExpenseList.jsx
	pages/
		IndexPage.jsx
		BudgetPage.jsx
		ExpensePage.jsx
	main.jsx
```

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Run the development server:

```bash
yarn dev
```

3. Build for production:

```bash
yarn build
```

4. Preview production build:

```bash
yarn preview
```

## Lint

```bash
yarn lint
```

## Offline and Storage Notes

- Planner data is persisted locally in IndexedDB.
- Data remains available when the device is offline.
- Because there is no backend, uninstalling/clearing browser site data removes stored planner data.

## PWA

- Service worker and manifest are configured through `vite-plugin-pwa` in `vite.config.js`.
- The app is auto-registered for updates through `src/app/providers/pwa.js`.

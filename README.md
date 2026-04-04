# Finflo — Finance Dashboard

A clean, interactive finance dashboard built with React for the Zorvyn Frontend Developer Intern assignment.

---

## Quick Start

### Prerequisites
- Node.js v16 or above
- npm v7 or above

### Steps

**1. Clone / download the project**
```bash
git clone <your-repo-url>
cd finflo
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm start
```

The app opens at `http://localhost:3000` automatically.

**4. Build for production**
```bash
npm run build
```

---

## Project Structure

```
finflo/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Overview.js        # Dashboard overview tab
│   │   ├── Transactions.js    # Transactions list with filters
│   │   ├── Budgets.js         # Budget limits management
│   │   ├── Alerts.js          # Budget alerts and warnings
│   │   └── Insights.js        # Data insights and charts
│   ├── context/
│   │   └── AppContext.js      # Global state via React Context
│   ├── data/
│   │   └── mockData.js        # Static mock transactions and budgets
│   ├── App.js                 # Root component, layout, routing
│   ├── App.css                # All styles (responsive, dark mode)
│   └── index.js               # React entry point
└── package.json
```

---

## Features

### 1. Dashboard Overview
- Four summary metric cards: Total Balance, Income, Expenses, Budget Used
- Budget snapshot strip showing top 4 category limits with progress bars
- Line chart showing 6-month balance trend (net, income, expenses)
- Doughnut chart showing spending breakdown by category for current month

### 2. Transactions
- Full list of 35 mock transactions with date, description, category, type, amount
- Search by description or category
- Filter by type (income / expense) and category
- Sort by date (newest/oldest) or amount (highest/lowest)
- Export all transactions to CSV
- Admin can add new transactions and remove existing ones

### 3. Budgets and Limits
- Set spending limits per category for monthly, weekly, or yearly periods
- Progress bars with color coding: green (safe), amber (80%+), red (exceeded)
- Total budget overview bar showing overall spend vs total limit
- Admin can add or edit limits; Viewer can only see them

### 4. Alerts
- Dedicated tab with count badge in navbar showing active alerts
- Three summary cards: Exceeded / Near limit / On track
- Full alert list with category, amount spent vs limit, and percentage bar
- Alert banner on Overview tab when any category hits 80%+ usage

### 5. Insights
- Six insight cards: top spending category, month-over-month expense change, average income, total savings, current month net, and active alert count
- Grouped bar chart comparing income vs expenses across 6 months
- Horizontal bar chart showing all-time top spending categories

### 6. Role-Based UI
- Admin: can add/edit transactions, set/edit budget limits, remove transactions
- Viewer: read-only access to all data, all management controls are hidden
- Switch roles via the dropdown in the topbar

### 7. Additional Features
- Dark mode toggle in topbar
- Data persistence using localStorage (transactions and budgets survive page refresh)
- Fully responsive layout (works on mobile, tablet, and desktop)
- Empty state handling when no data matches filters or no budgets are set

---

## State Management

Global state is managed using React Context (`AppContext.js`). The context provides:

- `transactions` — array of all transaction objects
- `budgets` — array of budget limit objects (cat, limit, period)
- `role` — current role: "admin" or "viewer"
- `darkMode` — boolean for theme toggle
- `activeTab` — currently active navigation tab
- Helper functions: `getSpent`, `getAlerts`, `getMonthlyData`, `fmt`
- CRUD methods: `addTransaction`, `deleteTransaction`, `upsertBudget`

Data is persisted to `localStorage` automatically on every change.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| React Context | State management |
| Chart.js + react-chartjs-2 | Charts and visualizations |
| CSS Variables | Theming and dark mode |
| localStorage | Data persistence |
| Create React App | Build tooling |

---

## Design Decisions

- No external UI library used — all components are built from scratch with CSS
- Chart.js chosen over Recharts for fine-grained canvas control
- Context chosen over Redux since the app state is shallow and co-located
- Indian Rupee (₹) used as currency with `en-IN` locale formatting
- Mock data uses realistic Indian salary and expense figures
- Color-coding is semantic: green for safe/positive, amber for warnings, red for danger

---

## Assignment Checklist

| Requirement | Status |
|---|---|
| Summary cards (balance, income, expenses) | Done |
| Time-based visualization (balance trend) | Done |
| Categorical visualization (spending breakdown) | Done |
| Transaction list with date, amount, category, type | Done |
| Filtering and search | Done |
| Role-based UI (Admin / Viewer) | Done |
| Insights section | Done |
| State management (Context) | Done |
| Responsive design | Done |
| Empty / no-data states | Done |
| Dark mode | Done |
| Data persistence (localStorage) | Done |
| Export functionality (CSV) | Done |
| Budget limits with notifications | Done (bonus) |

---

## Author

Dipali Kunwar — Frontend Developer Intern Assignment, Zorvyn FinTech Pvt. Ltd.

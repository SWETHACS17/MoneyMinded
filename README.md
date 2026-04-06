# MoneyMind — Personal Finance Dashboard

A modern, animated personal finance dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. Designed to help users track income, expenses, and gain financial insights through a visually rich, responsive interface.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

---

## Overview

MoneyMind is a frontend-only finance tracking dashboard that fulfils the requirements of the Finance Dashboard UI assignment. It features a dashboard overview with animated summary cards and charts, a filterable/searchable transactions section, a simulated role-based access system (Admin / Viewer), and an insights panel with spending analysis and monthly comparisons. All data is mock/static — no backend is required.

The project is structured using component-level separation of concerns with a single React Context (`DashboardContext`) managing all application state.

---

## Features

### 1. Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with animated entry transitions
- **Balance Trend Chart** — Time-based area chart showing a 6-month balance trend (powered by Recharts)
- **Spending Breakdown** — Animated SVG donut chart with per-category spending visualization and a pulsing centre glow
- **Hero Section** — Gradient banner with floating animated orbs and quick-view stats (Balance, Income, Savings Rate)

### 2. Transactions Section
- Scrollable table with Date, Description, Category, and Amount (colour-coded income/expense)
- **Search** — Real-time text search across description and category fields
- **Filter by Type** — All / Income / Expense dropdown
- **Filter by Category** — All categories or a specific one (Food, Bills, Transport, etc.)
- **Sort** — Toggle between sort-by-date and sort-by-amount
- **Admin actions** — Delete transaction (trash icon). Edit stub is present (pencil icon — wires up to full edit modal in a future iteration)
- **Empty state** — Friendly message shown when no transactions match filters

### 3. Role-Based UI (Simulated Frontend RBAC)
- **Viewer** — Can browse the full dashboard, transactions, and insights; add/delete controls are hidden
- **Admin** — Full access including an "Add Transaction" button and per-row delete action
- Role is toggled via a segmented control in the header (no login required — purely UI-level simulation)

### 4. Insights Section
- **Highest Spending Category** — Computed from live transaction data
- **Savings Rate** — Percentage of income retained after expenses
- **Monthly Comparison** — Animated bar chart across a 6-month window (Jan–Jun) with per-month income, expense, and savings breakdown and a trend badge showing month-over-month expense change

### 5. State Management
- **React Context API** (`DashboardContext`) manages:
  - Transaction list (mock seed data + runtime mutations)
  - Active navigation view
  - Filter, search, and sort state
  - Selected role (admin / viewer)
  - Dark mode preference
- Derived values (`filteredTransactions`, `totalBalance`, `totalIncome`, `totalExpenses`) are memoised with `useMemo`

### 6. UI / UX
- Fully responsive across mobile (≤640px), tablet (641–1024px), and desktop (>1024px)
- Light and dark mode (class-based Tailwind strategy, toggled from the header)
- Glassmorphism card style with backdrop blur
- macOS-inspired animated Dock navigation with spring-physics magnification
- Skeleton loader shown for ~1.2 s on first mount to simulate data fetching
- All interactive elements have graceful hover/tap micro-animations (Framer Motion / `motion`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| UI Primitives | shadcn/ui (Radix UI) |
| Charts | Recharts |
| Animations | Framer Motion (`motion`) |
| Routing | React Router DOM 6 |
| State | React Context API |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── components/
│   ├── AddTransactionModal.tsx   # Admin-only form for adding a new transaction
│   ├── BalanceTrendChart.tsx      # 6-month area chart for balance over time
│   ├── BorderGlowCard.tsx        # Card with edge-proximity cursor glow effect
│   ├── DashboardView.tsx         # Dashboard tab layout (cards + charts)
│   ├── Dock.tsx                  # macOS-style animated bottom navigation bar
│   ├── Header.tsx                # App header with role toggle and dark mode switch
│   ├── HeroSection.tsx           # Gradient hero with floating orbs and quick stats
│   ├── InsightsPanel.tsx         # Spending insights and monthly comparison view
│   ├── NavLink.tsx               # Reusable navigation link component
│   ├── SkeletonLoader.tsx        # Shimmer loading skeletons for initial page load
│   ├── SpendingBreakdown.tsx     # SVG donut chart for categorical spending
│   ├── SummaryCards.tsx          # Balance / Income / Expenses summary cards
│   ├── TransactionList.tsx       # Filterable, sortable transaction table
│   └── ui/                       # shadcn/ui primitive components (untouched)
├── context/
│   └── DashboardContext.tsx      # Global state provider and mock data seed
├── hooks/
│   ├── use-mobile.tsx            # Mobile breakpoint detection hook
│   └── use-toast.ts              # Toast notification hook
├── pages/
│   ├── Index.tsx                 # Root page — wraps provider and assembles layout
│   └── NotFound.tsx              # 404 fallback page
├── lib/
│   └── utils.ts                  # Utility: `cn()` classname helper
├── index.css                     # Design tokens (HSL custom properties) and global styles
├── App.tsx                       # React Router setup
└── main.tsx                      # Application entry point
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd finance-flow-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Testing

```bash
# Run unit tests (Vitest + Testing Library)
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| < 640px (mobile) | Single-column layouts, compact dock, square insight cards |
| 640–1024px (tablet) | Two-column grids, condensed charts |
| > 1024px (desktop) | Full multi-column layouts, expanded visualisations |

---

## Dark Mode

Dark mode uses Tailwind's `class` strategy. The toggle in the header adds/removes the `dark` class on `<html>`, which flips all semantic HSL colour tokens defined in `index.css`.

---

## Role-Based Access (Simulated)

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Delete transactions | ❌ | ✅ |
| Role indicator in header | ✅ | ✅ |

Roles are switched via the segmented toggle in the header. No authentication or backend is involved — the role is stored in React state and drives conditional rendering.

---

## Design Decisions & Assumptions

1. **Mock Data** — All transactions are seeded in `DashboardContext.tsx`. Data spans March–April 2026 to allow a meaningful month-over-month comparison.
2. **No Backend** — The app is entirely client-side. No API calls, databases, or server-side logic.
3. **Role Simulation** — RBAC is implemented by toggling a state variable that conditionally renders admin-only UI elements. This satisfies the assignment's requirement for a demonstrable role switch.
4. **Monthly Comparison Data** — The Insights panel uses a separate 6-month dummy dataset (Jan–Jun) for a richer visualisation than the transaction seed data alone would produce.
5. **Edit Flow** — The edit (pencil) button is present in Admin mode but wires to a stub; a full in-place edit modal would be straightforward to add by reusing `AddTransactionModal` pre-populated with the selected transaction.
6. **Custom SVG Chart** — The spending donut ring is implemented as a hand-rolled animated SVG rather than a Recharts `PieChart`, demonstrating direct SVG manipulation and Framer Motion integration.

---

## License

This project is submitted for evaluation purposes only.

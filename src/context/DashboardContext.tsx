import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

export type Role = 'admin' | 'viewer';
export type TransactionType = 'income' | 'expense';
export type Category = 'Food' | 'Transport' | 'Shopping' | 'Entertainment' | 'Health' | 'Bills' | 'Salary' | 'Freelance' | 'Investment' | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

interface Filters {
  search: string;
  type: TransactionType | 'all';
  category: Category | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface DashboardState {
  role: Role;
  transactions: Transaction[];
  filters: Filters;
  activeView: string;
  isDark: boolean;
  isLoading: boolean;
}

interface DashboardContextType extends DashboardState {
  setRole: (r: Role) => void;
  setFilters: (f: Partial<Filters>) => void;
  setActiveView: (v: string) => void;
  toggleDark: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filteredTransactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-04-01', description: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary' },
  { id: '2', date: '2026-04-01', description: 'Rent Payment', amount: 1400, type: 'expense', category: 'Bills' },
  { id: '3', date: '2026-04-02', description: 'Grocery Shopping', amount: 89.50, type: 'expense', category: 'Food' },
  { id: '4', date: '2026-03-30', description: 'Freelance Project', amount: 1200, type: 'income', category: 'Freelance' },
  { id: '5', date: '2026-03-29', description: 'Uber Rides', amount: 45.00, type: 'expense', category: 'Transport' },
  { id: '6', date: '2026-03-28', description: 'Netflix Subscription', amount: 15.99, type: 'expense', category: 'Entertainment' },
  { id: '7', date: '2026-03-27', description: 'Gym Membership', amount: 50, type: 'expense', category: 'Health' },
  { id: '8', date: '2026-03-25', description: 'Stock Dividend', amount: 340, type: 'income', category: 'Investment' },
  { id: '9', date: '2026-03-24', description: 'New Sneakers', amount: 120, type: 'expense', category: 'Shopping' },
  { id: '10', date: '2026-03-22', description: 'Restaurant Dinner', amount: 67.80, type: 'expense', category: 'Food' },
  { id: '11', date: '2026-03-20', description: 'Electric Bill', amount: 85, type: 'expense', category: 'Bills' },
  { id: '12', date: '2026-03-18', description: 'Freelance Design', amount: 800, type: 'income', category: 'Freelance' },
  { id: '13', date: '2026-03-15', description: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary' },
  { id: '14', date: '2026-03-14', description: 'Coffee & Snacks', amount: 23.40, type: 'expense', category: 'Food' },
  { id: '15', date: '2026-03-12', description: 'Online Course', amount: 49.99, type: 'expense', category: 'Other' },
  { id: '16', date: '2026-03-10', description: 'Movie Tickets', amount: 32, type: 'expense', category: 'Entertainment' },
  { id: '17', date: '2026-03-08', description: 'Gas Station', amount: 55, type: 'expense', category: 'Transport' },
  { id: '18', date: '2026-03-05', description: 'Investment Return', amount: 200, type: 'income', category: 'Investment' },
  { id: '19', date: '2026-03-03', description: 'Phone Bill', amount: 65, type: 'expense', category: 'Bills' },
  { id: '20', date: '2026-03-01', description: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary' },
];

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('role');
    return (saved as Role) || 'admin';
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_TRANSACTIONS;
  });
  
  const [filters, setFiltersState] = useState<Filters>({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [activeView, setActiveView] = useState('dashboard');
  
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('isDark');
    if (saved) return JSON.parse(saved);
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  const toggleDark = useCallback(() => setIsDark(p => !p), []);

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    if (filters.type !== 'all') result = result.filter(t => t.type === filters.type);
    if (filters.category !== 'all') result = result.filter(t => t.category === filters.category);
    result.sort((a, b) => {
      const mul = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalBalance = totalIncome - totalExpenses;

  return (
    <DashboardContext.Provider value={{
      role, setRole, transactions, filters, setFilters, activeView, setActiveView,
      isDark, toggleDark, isLoading, addTransaction, editTransaction, deleteTransaction,
      filteredTransactions, totalBalance, totalIncome, totalExpenses,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

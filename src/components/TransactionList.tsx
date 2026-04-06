import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowUpDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { useDashboard, type Category, type TransactionType, type Transaction } from '@/context/DashboardContext';
import { useState } from 'react';
import AddTransactionModal from './AddTransactionModal';

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Salary', 'Freelance', 'Investment', 'Other'];

export default function TransactionList() {
  const { filteredTransactions, filters, setFilters, role, deleteTransaction } = useDashboard();
  const [showAdd, setShowAdd] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const openAdd = () => { setEditingTransaction(null); setShowAdd(true); };
  const openEdit = (t: Transaction) => { setEditingTransaction(t); setShowAdd(true); };
  const closeModal = () => { setShowAdd(false); setEditingTransaction(null); };

  const toggleSort = () => {
    if (filters.sortBy === 'date') {
      setFilters({ sortBy: 'amount' });
    } else {
      setFilters({ sortBy: 'date', sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-5 lg:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-heading font-semibold">Transactions</h3>
        {role === 'admin' && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openAdd()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>
        <select
          value={filters.type}
          onChange={e => setFilters({ type: e.target.value as TransactionType | 'all' })}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filters.category}
          onChange={e => setFilters({ category: e.target.value as Category | 'all' })}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={toggleSort} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-background text-sm hover:bg-secondary transition">
          <ArrowUpDown className="w-4 h-4" />
          <span className="hidden sm:inline">{filters.sortBy === 'date' ? 'Date' : 'Amount'}</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Description</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Category</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Amount</th>
                {role === 'admin' && <th className="text-right py-3 px-2 text-muted-foreground font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransactions.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-2 text-muted-foreground">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="py-3 px-2 font-medium">{t.description}</td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">{t.category}</span>
                    </td>
                    <td className={`py-3 px-2 text-right font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    {role === 'admin' && (
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-secondary transition"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button onClick={() => deleteTransaction(t.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      <AddTransactionModal open={showAdd} onClose={closeModal} editingTransaction={editingTransaction} />
    </motion.div>
  );
}

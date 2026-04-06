import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDashboard, type Category, type TransactionType, type Transaction } from '@/context/DashboardContext';

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Salary', 'Freelance', 'Investment', 'Other'];

interface Props {
  open: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

const BLANK_FORM = { description: '', amount: '', type: 'expense' as TransactionType, category: 'Food' as Category, date: new Date().toISOString().slice(0, 10) };

export default function AddTransactionModal({ open, onClose, editingTransaction }: Props) {
  const { addTransaction, editTransaction } = useDashboard();
  const isEdit = !!editingTransaction;

  const [form, setForm] = useState(BLANK_FORM);

  useEffect(() => {
    if (open) {
      if (editingTransaction) {
        setForm({
          description: editingTransaction.description,
          amount: String(editingTransaction.amount),
          type: editingTransaction.type,
          category: editingTransaction.category,
          date: editingTransaction.date,
        });
      } else {
        setForm({ ...BLANK_FORM, date: new Date().toISOString().slice(0, 10) });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [open, editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    if (isEdit && editingTransaction) {
      editTransaction(editingTransaction.id, { ...form, amount: parseFloat(form.amount) });
    } else {
      addTransaction({ ...form, amount: parseFloat(form.amount) });
    }
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-heading font-semibold">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Amount</label>
                  <input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TransactionType }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
              >
                {isEdit ? 'Save Changes' : 'Add Transaction'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

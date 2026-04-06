import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import BorderGlowCard from './BorderGlowCard';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const cards = [
  { key: 'balance', label: 'Monthly Balance', icon: Wallet, color: 'text-primary' },
  { key: 'income', label: 'Total Income', icon: TrendingUp, color: 'text-success' },
  { key: 'expenses', label: 'Total Expenses', icon: TrendingDown, color: 'text-destructive' },
] as const;

export default function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useDashboard();
  const values = { balance: totalBalance, income: totalIncome, expenses: totalExpenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <BorderGlowCard className="h-full">
            <div className="p-5 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="text-2xl lg:text-3xl font-bold font-heading gradient-text"
              >
                {formatCurrency(values[card.key])}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-2">
                {card.key === 'balance' ? 'Net balance' : card.key === 'income' ? '+12% from last month' : '-3% from last month'}
              </p>
            </div>
          </BorderGlowCard>
        </motion.div>
      ))}
    </div>
  );
}

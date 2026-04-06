import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { useMemo } from 'react';
import BorderGlowCard from './BorderGlowCard';

function AnimatedBar({ label, value, max, color, delay }: { label: string; value: number; max: number; color: string; delay: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">${value.toLocaleString()}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

const MONTHLY_DUMMY = [
  { month: 'Jan', income: 4200, expense: 3100 },
  { month: 'Feb', income: 4500, expense: 3400 },
  { month: 'Mar', income: 5200, expense: 3800 },
  { month: 'Apr', income: 4800, expense: 2900 },
  { month: 'May', income: 5100, expense: 3600 },
  { month: 'Jun', income: 4900, expense: 3200 },
];


export default function InsightsPanel() {
  const { transactions, totalIncome, totalExpenses } = useDashboard();

  const analysis = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');

    const catMap: Record<string, number> = {};
    expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats[0];

    const marchExp = expenses.filter(t => t.date.startsWith('2026-03')).reduce((s, t) => s + t.amount, 0);
    const aprilExp = expenses.filter(t => t.date.startsWith('2026-04')).reduce((s, t) => s + t.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    const expenseChange = marchExp > 0 ? ((aprilExp - marchExp) / marchExp * 100) : 0;

    return { topCategory, sortedCats, marchExp, aprilExp, savingsRate, expenseChange };
  }, [transactions, totalIncome, totalExpenses]);

  const primaryInsights = [
    {
      icon: AlertTriangle,
      title: 'Highest Spending',
      description: analysis.topCategory ? `${analysis.topCategory[0]} at $${analysis.topCategory[1].toLocaleString()}` : 'No data',
      iconColor: 'text-accent',
    },
    {
      icon: Star,
      title: 'Savings Rate',
      description: `${analysis.savingsRate.toFixed(1)}% of income saved`,
      iconColor: 'text-success',
    },
  ];

  const maxMonthly = Math.max(...MONTHLY_DUMMY.map(m => Math.max(m.income, m.expense)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-heading font-semibold">Insights</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {primaryInsights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 100 }}
          >
            <BorderGlowCard>
              <div className="p-3 sm:p-4 flex flex-row items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-secondary flex-shrink-0 self-center"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <insight.icon className={`w-4 h-4 ${insight.iconColor}`} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{insight.description}</p>
                </div>
              </div>
            </BorderGlowCard>
          </motion.div>
        ))}
      </div>

      {/* Monthly Comparison — expanded breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
      >
        <BorderGlowCard>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h4 className="font-heading font-semibold text-sm">Monthly Comparison</h4>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className={`flex items-center gap-1 text-xs font-medium ${analysis.expenseChange <= 0 ? 'text-success' : 'text-destructive'}`}
              >
                {analysis.expenseChange <= 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {Math.abs(analysis.expenseChange).toFixed(1)}% vs last month
              </motion.div>
            </div>

            {/* Bar chart visualization */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {MONTHLY_DUMMY.map((m, i) => {
                const incPct = (m.income / maxMonthly) * 100;
                const expPct = (m.expense / maxMonthly) * 100;
                return (
                  <motion.div
                    key={m.month}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-end gap-1 h-20 sm:h-24 w-full justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${incPct}%` }}
                        transition={{ delay: 0.8 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                        className="w-3 sm:w-4 rounded-t-sm bg-gradient-to-t from-primary to-primary/60"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${expPct}%` }}
                        transition={{ delay: 0.9 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                        className="w-3 sm:w-4 rounded-t-sm bg-gradient-to-t from-accent to-accent/60"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-medium">{m.month}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent" /> Expenses
              </span>
            </div>

            {/* Detailed breakdown per month */}
            <div className="space-y-3">
              {MONTHLY_DUMMY.map((m, i) => {
                const savings = m.income - m.expense;
                const savPct = ((savings / m.income) * 100).toFixed(0);
                return (
                  <motion.div
                    key={m.month}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.06 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                  >
                    <span className="font-medium text-xs sm:text-sm w-10">{m.month}</span>
                    <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Income</span>
                        <span className="font-medium text-primary">${m.income.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Expenses</span>
                        <span className="font-medium text-accent">${m.expense.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Saved</span>
                        <span className={`font-medium ${savings >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ${savings.toLocaleString()} ({savPct}%)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </BorderGlowCard>
      </motion.div>
    </motion.div>
  );
}

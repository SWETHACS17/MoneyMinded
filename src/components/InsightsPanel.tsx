import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Star, ArrowUpRight, ArrowDownRight, Activity, Target, Calendar } from 'lucide-react';
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

const CATEGORY_COLORS: Record<string, string> = {
  Bills: 'hsl(220, 75%, 55%)',
  Food: 'hsl(25, 95%, 58%)',
  Transport: 'hsl(340, 80%, 68%)',
  Shopping: 'hsl(200, 80%, 55%)',
  Entertainment: 'hsl(260, 60%, 55%)',
  Health: 'hsl(150, 60%, 45%)',
  Other: 'hsl(40, 90%, 55%)',
};

function SpendingVelocityGauge({
  dailyAvg,
  budget,
  gradient = ['#22c55e', '#eab308', '#ef4444'],
}: {
  dailyAvg: number;
  budget: number;
  gradient?: string[];
}) {
  const pct = Math.min((dailyAvg / budget) * 100, 100);
  const strokeDashoffset = 283 - (283 * pct) / 100;
  const gradientId = 'velocityGradient';
  const barGradientId = 'velocityBarGradient';

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="50%" stopColor={gradient[1]} />
              <stop offset="100%" stopColor={gradient[2]} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.15, rotate: [-2, 2, 0] }}
            transition={{ delay: 1, type: 'spring' }}
            className="text-lg sm:text-xl font-bold font-heading cursor-default"
          >
            ${dailyAvg.toFixed(0)}
          </motion.span>
          <span className="text-[10px] text-muted-foreground">per day</span>
        </div>
      </div>
      <div className="flex-1 w-full space-y-2 text-center sm:text-left">
        <p className="text-xs text-muted-foreground">
          You're spending <span className="font-semibold text-foreground">{pct.toFixed(0)}%</span> of your daily budget
        </p>
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
          <svg width="100%" height="100%" className="absolute opacity-0 pointer-events-none">
            <defs>
              <linearGradient id={barGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradient[0]} />
                <stop offset="50%" stopColor={gradient[1]} />
                <stop offset="100%" stopColor={gradient[2]} />
              </linearGradient>
            </defs>
          </svg>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${gradient[0]}, ${gradient[1]}, ${gradient[2]})`,
              maxWidth: '100%',
            }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          Budget: ${budget}/day • {pct <= 50 ? 'On track!' : pct <= 80 ? 'Watch spending' : 'Over budget'}
        </p>
      </div>
    </div>
  );
}

function WeeklySpendHeatmap({ transactions }: { transactions: { date: string; amount: number; type: string }[] }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timePeriods = ['Morning', 'Afternoon', 'Evening'];

  // grid[day][timePeriod] — 7 days × 3 periods
  const heatData = useMemo(() => {
    const grid: number[][] = Array.from({ length: 7 }, () => [0, 0, 0]);
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const d = new Date(t.date);
        const day = d.getDay();
        const idx = Math.floor(Math.random() * 3);
        grid[day][idx] += t.amount;
      });
    return grid;
  }, [transactions]);

  const maxVal = Math.max(...heatData.flat(), 1);

  // Transposed: X = days (columns), Y = time periods (rows)
  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[280px]">
        {/* grid: 1 label col + 7 day cols */}
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1">
          {/* Top-left empty cell */}
          <div />
          {/* Day headers (X-axis) */}
          {days.map(day => (
            <div key={day} className="text-[10px] text-muted-foreground text-center pb-1 font-medium">{day}</div>
          ))}
          {/* Rows: one per time period */}
          {timePeriods.map((period, pi) => (
            <>
              <div key={`label-${period}`} className="text-[10px] text-muted-foreground pr-2 flex items-center font-medium whitespace-nowrap">{period}</div>
              {days.map((day, di) => {
                const val = heatData[di][pi];
                const intensity = val / maxVal;
                return (
                  <motion.div
                    key={`${pi}-${di}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    transition={{ delay: 0.3 + pi * 0.08 + di * 0.04, type: 'spring' }}
                    className="aspect-square rounded-md cursor-default relative group"
                    style={{
                      background: intensity > 0
                        ? `hsl(220, 75%, ${Math.max(55 - intensity * 30, 25)}%, ${0.15 + intensity * 0.7})`
                        : 'hsl(var(--secondary))',
                    }}
                    title={`${day} ${period}: $${val.toFixed(0)}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[7px] font-bold">${val.toFixed(0)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </>
          ))}
        </div>
        <div className="flex items-center justify-end gap-1 mt-2">
          <span className="text-[9px] text-muted-foreground">Less</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-[2px]"
              style={{ background: `hsl(220, 75%, ${Math.max(55 - intensity * 30, 25)}%, ${0.15 + intensity * 0.7})` }}
            />
          ))}
          <span className="text-[9px] text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}

function CategoryBubbleChart({ categories }: { categories: [string, number][] }) {
  const top = categories.slice(0, 6);
  const maxVal = Math.max(...top.map(c => c[1]), 1);
  const totalVal = top.reduce((s, c) => s + c[1], 0);

  // Pack circles in a nice layout
  const bubbles = useMemo(() => {
    const cx = 130, cy = 110;
    const maxRadius = 48;
    const minRadius = 18;
    const result: { x: number; y: number; r: number; cat: string; val: number; color: string }[] = [];

    // Simple layout: place bubbles in a cluster pattern
    const positions = [
      { x: 0, y: 0 },
      { x: -55, y: -30 },
      { x: 55, y: -25 },
      { x: -40, y: 40 },
      { x: 50, y: 45 },
      { x: -5, y: -58 },
    ];

    top.forEach(([cat, val], i) => {
      const pct = val / maxVal;
      const r = minRadius + (maxRadius - minRadius) * pct;
      const pos = positions[i] || { x: 0, y: 0 };
      result.push({
        x: cx + pos.x,
        y: cy + pos.y,
        r,
        cat,
        val,
        color: CATEGORY_COLORS[cat] || 'hsl(220, 75%, 55%)',
      });
    });

    return result;
  }, [top, maxVal]);

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 260 220" className="w-full max-w-[260px] sm:max-w-[300px]">
        {bubbles.map((b, i) => (
          <g key={b.cat}>
            {/* Bubble */}
            <motion.circle
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill={b.color}
              fillOpacity={0.2}
              stroke={b.color}
              strokeWidth={1.5}
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: b.r, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.7, type: 'spring', stiffness: 120 }}
              style={{ transformOrigin: `${b.x}px ${b.y}px` }}
              className="cursor-pointer"
            />
            {/* Percentage inside */}
            <motion.text
              x={b.x}
              y={b.y - (b.r > 30 ? 5 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
              fontSize={b.r > 30 ? 12 : 9}
              fontWeight="700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {((b.val / totalVal) * 100).toFixed(0)}%
            </motion.text>
            {/* Category name inside (if bubble large enough) */}
            {b.r > 25 && (
              <motion.text
                x={b.x}
                y={b.y + (b.r > 30 ? 10 : 7)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground"
                fontSize={b.r > 35 ? 8 : 7}
                fontWeight="500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                {b.cat}
              </motion.text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}


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

    const uniqueDays = new Set(expenses.map(t => t.date));
    const daysCount = Math.max(uniqueDays.size, 1);
    const dailyAvg = totalExpenses / daysCount;

    const expenseCount = expenses.length;
    const avgTransactionSize = expenseCount > 0 ? totalExpenses / expenseCount : 0;

    const incomeSourceMap: Record<string, number> = {};
    incomes.forEach(t => { incomeSourceMap[t.category] = (incomeSourceMap[t.category] || 0) + t.amount; });
    const incomeSources = Object.entries(incomeSourceMap).sort((a, b) => b[1] - a[1]);

    return { topCategory, sortedCats, marchExp, aprilExp, savingsRate, expenseChange, dailyAvg, avgTransactionSize, expenseCount, incomeSources };
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
    {
      icon: Activity,
      title: 'Avg Transaction',
      description: `$${analysis.avgTransactionSize.toFixed(0)} per expense (${analysis.expenseCount} total)`,
      iconColor: 'text-primary',
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      {/* Monthly Comparison */}
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
                        className="w-3 sm:w-4 bg-gradient-to-t from-primary to-primary/60"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${expPct}%` }}
                        transition={{ delay: 0.9 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                        className="w-3 sm:w-4 bg-gradient-to-t from-accent to-accent/60"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-medium">{m.month}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-primary" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-accent" /> Expenses
              </span>
            </div>

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

      {/* Spending Velocity + Category Distribution (left) | Heatmap (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

        {/* LEFT COLUMN: Spending Velocity stacked above Category Distribution */}
        <div className="flex flex-col gap-4">

          {/* Spending Velocity — compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 80 }}
          >
            <BorderGlowCard>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h4 className="font-heading font-semibold text-sm">Spending Velocity</h4>
                </div>
                <SpendingVelocityGauge
                  dailyAvg={analysis.dailyAvg}
                  budget={200}
                  gradient={['#22c55e', '#eab308', '#ef4444']}
                />
              </div>
            </BorderGlowCard>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 80 }}
          >
            <BorderGlowCard className="h-full">
              <div className="p-3 sm:p-4 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-accent" />
                  <h4 className="font-heading font-semibold text-sm">Category Distribution</h4>
                </div>
                <CategoryBubbleChart categories={analysis.sortedCats} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {analysis.sortedCats.slice(0, 6).map(([cat, val], i) => (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.06 }}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[cat] || 'hsl(220, 75%, 55%)' }}
                      />
                      <span className="text-muted-foreground truncate">{cat}</span>
                      <span className="ml-auto font-medium">${val.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BorderGlowCard>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Spending Heatmap (heatmap + income sources side-by-side inside) */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 80 }}
        >
          <BorderGlowCard className="h-full">
            <div className="p-4 sm:p-5 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-success" />
                <h4 className="font-heading font-semibold text-sm">Spending Heatmap</h4>
              </div>
              {/* Heatmap */}
              <div className="flex-1 min-w-0 flex items-start justify-center lg:justify-start overflow-x-auto">
                <WeeklySpendHeatmap transactions={transactions} />
              </div>
              {/* Income Sources — below heatmap */}
              <div className="mt-auto pt-4 border-t border-border/30">
                <p className="text-xs font-medium text-muted-foreground mb-3">Income Sources</p>
                <div className="space-y-2">
                  {analysis.incomeSources.map(([source, amount], i) => {
                    const pct = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                    return (
                      <motion.div
                        key={source}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + i * 0.08 }}
                        className="space-y-1"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{source}</span>
                          <span className="font-medium">${amount.toLocaleString()} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 1.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-success to-primary"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </BorderGlowCard>
        </motion.div>

      </div>
    </motion.div>
  );
}
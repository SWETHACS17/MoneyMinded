import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Oct', balance: 8200 },
  { month: 'Nov', balance: 9100 },
  { month: 'Dec', balance: 8700 },
  { month: 'Jan', balance: 10400 },
  { month: 'Feb', balance: 11200 },
  { month: 'Mar', balance: 12940 },
];

export default function BalanceTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-5 lg:p-6"
    >
      <h3 className="text-lg font-heading font-semibold mb-4">Balance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(220, 75%, 55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(340, 80%, 78%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 45%)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 45%)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                background: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 15%, 90%)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
            />
            <Area type="monotone" dataKey="balance" stroke="hsl(220, 75%, 55%)" strokeWidth={2.5} fill="url(#balanceGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

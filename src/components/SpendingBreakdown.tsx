import { motion } from 'motion/react';
import { useDashboard } from '@/context/DashboardContext';
import { useMemo } from 'react';

const COLORS = [
  'hsl(220, 75%, 55%)',
  'hsl(25, 95%, 58%)',
  'hsl(340, 80%, 68%)',
  'hsl(200, 80%, 55%)',
  'hsl(260, 60%, 55%)',
  'hsl(150, 60%, 45%)',
  'hsl(40, 90%, 55%)',
  'hsl(0, 72%, 55%)',
];

interface ArcProps {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  color: string;
  delay: number;
  label: string;
  value: number;
  total: number;
}

function AnimatedArc({ startAngle, endAngle, innerRadius, outerRadius, color, delay, label, value, total }: ArcProps) {
  const cx = 120, cy = 120;
  
  const describeArc = (start: number, end: number, ir: number, or: number) => {
    const startRad = (start - 90) * Math.PI / 180;
    const endRad = (end - 90) * Math.PI / 180;
    const x1 = cx + or * Math.cos(startRad);
    const y1 = cy + or * Math.sin(startRad);
    const x2 = cx + or * Math.cos(endRad);
    const y2 = cy + or * Math.sin(endRad);
    const x3 = cx + ir * Math.cos(endRad);
    const y3 = cy + ir * Math.sin(endRad);
    const x4 = cx + ir * Math.cos(startRad);
    const y4 = cy + ir * Math.sin(startRad);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${or} ${or} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const path = describeArc(startAngle, endAngle, innerRadius, outerRadius);
  const pct = ((value / total) * 100).toFixed(1);

  return (
    <motion.path
      d={path}
      fill={color}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay, duration: 0.6, type: 'spring', stiffness: 80 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      className="cursor-pointer"
    >
      <title>{label}: ${value.toLocaleString()} ({pct}%)</title>
    </motion.path>
  );
}

export default function SpendingBreakdown() {
  const { transactions } = useDashboard();

  const data = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: +value.toFixed(2) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  const arcs = useMemo(() => {
    let currentAngle = 0;
    const gap = 3;
    return data.map((item, i) => {
      const sweep = (item.value / total) * (360 - gap * data.length);
      const arc = {
        startAngle: currentAngle,
        endAngle: currentAngle + sweep,
        color: COLORS[i % COLORS.length],
        label: item.name,
        value: item.value,
        delay: 0.3 + i * 0.1,
      };
      currentAngle += sweep + gap;
      return arc;
    });
  }, [data, total]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-xl p-5 lg:p-6"
    >
      <h3 className="text-lg font-heading font-semibold mb-4">Spending Breakdown</h3>
      <div className="h-64 flex items-center">
        <div className="w-[50%] h-full flex items-center justify-center">
          <svg viewBox="0 0 240 240" className="w-full h-full max-w-[200px]">
            <motion.circle
              cx="120" cy="120" r="42"
              fill="none"
              stroke="url(#centerGlow)"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(220, 75%, 55%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(340, 80%, 68%)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {arcs.map((arc, i) => (
              <AnimatedArc
                key={i}
                startAngle={arc.startAngle}
                endAngle={arc.endAngle}
                innerRadius={50}
                outerRadius={85}
                color={arc.color}
                delay={arc.delay}
                label={arc.label}
                value={arc.value}
                total={total}
              />
            ))}

            <motion.circle
              cx="120" cy="120" r="88"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '120px 120px' }}
            />
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(220, 75%, 55%)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="hsl(340, 80%, 68%)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(25, 95%, 58%)" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            <text x="120" y="115" textAnchor="middle" className="fill-foreground text-xs font-heading font-bold" fontSize="14">
              ${total.toLocaleString()}
            </text>
            <text x="120" y="132" textAnchor="middle" className="fill-muted-foreground" fontSize="9">
              Total Spent
            </text>
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {data.slice(0, 5).map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-center gap-2 text-sm"
            >
              <motion.div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <span className="text-muted-foreground truncate">{item.name}</span>
              <span className="ml-auto font-medium">${item.value.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

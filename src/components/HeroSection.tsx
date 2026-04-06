import { motion } from 'motion/react';
import { useDashboard } from '@/context/DashboardContext';
import { Sparkles, ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const { totalBalance, totalIncome, totalExpenses } = useDashboard();
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0';

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-6"
    >
      <div className="absolute inset-0 hero-gradient-bg" />
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-[15%] w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-[hsl(340_80%_78%/0.3)] to-[hsl(25_95%_58%/0.2)] blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 20, 0], y: [0, 20, -15, 0], scale: [1, 0.9, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-5 left-[10%] w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[hsl(220_75%_55%/0.25)] to-[hsl(200_80%_72%/0.2)] blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 15, -10, 0], y: [0, -10, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[hsl(260_60%_55%/0.2)] to-[hsl(340_80%_68%/0.15)] blur-3xl"
      />

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >


            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-heading font-bold leading-tight mb-3"
            >
              <span className="gradient-text">Take Control</span>
              <br />
              <span className="text-foreground">of Your Finances</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm sm:text-base max-w-md"
            >
              Track spending, monitor income, and build smarter financial habits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Scroll to explore your dashboard</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            className="hidden sm:flex flex-row lg:flex-col gap-3 sm:gap-4"
          >
            {[
              { label: 'Balance', value: `$${totalBalance.toLocaleString()}`, gradient: 'from-[hsl(220_75%_55%)] to-[hsl(200_80%_72%)]' },
              { label: 'Income', value: `$${totalIncome.toLocaleString()}`, gradient: 'from-[hsl(150_60%_45%)] to-[hsl(200_80%_72%)]' },
              { label: 'Savings', value: `${savingsRate}%`, gradient: 'from-[hsl(340_80%_78%)] to-[hsl(25_95%_58%)]' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex-1 lg:flex-none glass-card rounded-xl px-5 py-3 sm:px-6 sm:py-4 min-w-0"
              >
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold font-heading bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

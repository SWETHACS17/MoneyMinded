import { motion } from 'motion/react';
import { Moon, Sun, Shield, Eye } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

export default function Header() {
  const { role, setRole, isDark, toggleDark } = useDashboard();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4"
    >
      {/* Logo + Brand */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <motion.img
          src="/favicon.ico"
          alt="MoneyMind logo"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain flex-shrink-0"
          initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        />
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-heading font-bold gradient-text leading-none">MoneyMind</h1>
          <p className="text-xs text-muted-foreground mt-0.5 hidden xs:block">Control Your Finances</p>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-secondary rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md font-medium transition-all ${role === 'admin' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button
            onClick={() => setRole('viewer')}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md font-medium transition-all ${role === 'viewer' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Viewer</span>
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDark}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
      </div>
    </motion.header>
  );
}

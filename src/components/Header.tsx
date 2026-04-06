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
      <div>
        <h1 className="text-xl sm:text-2xl font-heading font-bold gradient-text">MoneyMind</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Control Your Finances</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-secondary rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-all ${role === 'admin' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            <Shield className="w-3.5 h-3.5" /> Admin
          </button>
          <button
            onClick={() => setRole('viewer')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-all ${role === 'viewer' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            <Eye className="w-3.5 h-3.5" /> Viewer
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

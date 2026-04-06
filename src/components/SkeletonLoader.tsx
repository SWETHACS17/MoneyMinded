import { motion } from 'motion/react';

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg p-6 space-y-3"
    >
      <div className="skeleton-loader h-4 w-24 rounded-md" />
      <div className="skeleton-loader h-8 w-36 rounded-md" />
      <div className="skeleton-loader h-3 w-20 rounded-md" />
    </motion.div>
  );
}

export function ChartSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-6 space-y-4">
      <div className="skeleton-loader h-5 w-32 rounded-md" />
      <div className="flex items-end gap-2 h-40">
        {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
          <div key={i} className="skeleton-loader flex-1 rounded-t-md" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </motion.div>
  );
}

export function TableSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-6 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4" style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="skeleton-loader h-4 w-20 rounded-md" />
          <div className="skeleton-loader h-4 flex-1 rounded-md" />
          <div className="skeleton-loader h-4 w-16 rounded-md" />
          <div className="skeleton-loader h-4 w-16 rounded-md" />
        </div>
      ))}
    </motion.div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen gradient-bg-subtle">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" />
        <p className="text-sm text-muted-foreground font-medium">Loading your finances...</p>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BarChart3, PieChart, Wallet, TrendingUp, Shield, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LottieLoader from '@/components/LottieLoader';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Visualize spending patterns with interactive charts and real-time data.',
    gradient: 'from-[hsl(220,75%,55%)] to-[hsl(200,80%,72%)]',
  },
  {
    icon: PieChart,
    title: 'Spending Breakdown',
    description: 'See exactly where your money goes with category-based insights.',
    gradient: 'from-[hsl(340,80%,68%)] to-[hsl(25,95%,58%)]',
  },
  {
    icon: TrendingUp,
    title: 'Trend Tracking',
    description: 'Monitor your financial health over time with balance trends.',
    gradient: 'from-[hsl(150,60%,45%)] to-[hsl(200,80%,72%)]',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Admin and viewer roles to control who can modify data.',
    gradient: 'from-[hsl(260,60%,55%)] to-[hsl(220,75%,55%)]',
  },
];


export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LottieLoader message="Welcome to MoneyMind..." />;

  return (
    <AnimatePresence>
      <div className="min-h-screen gradient-bg-subtle overflow-hidden relative">

        {/* Animated gradient blobs */}
        <motion.div
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] right-[10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-[hsl(340_80%_78%/0.15)] to-[hsl(25_95%_58%/0.1)] blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[5%] left-[5%] w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-br from-[hsl(220_75%_55%/0.12)] to-[hsl(200_80%_72%/0.08)] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, -15, 0], y: [0, -15, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[50%] left-[40%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-br from-[hsl(260_60%_55%/0.1)] to-[hsl(340_80%_68%/0.08)] blur-[90px]"
        />

        {/* Header from Dashboard */}
        <div className="relative z-50 bg-background/50 backdrop-blur-md border-b border-border/30 sticky top-0">
          <Header />
        </div>

        {/* Hero */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-6 sm:px-10 pt-10 sm:pt-16 lg:pt-20 pb-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 80 }}
            className="text-left w-full lg:w-1/2"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] mb-6"
            >
              <span className="gradient-text">Master Your</span>
              <br />
              <span className="text-foreground">Money</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Track every dollar, visualize your spending patterns, and make smarter financial
              decisions with beautiful, real-time analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px hsl(220 75% 55% / 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="group flex flex-1 sm:flex-none items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-[hsl(200,80%,55%)] text-primary-foreground text-base font-semibold shadow-xl shadow-primary/20 transition-all justify-center sm:justify-start"
              >
                Go to dashboard
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
            className="w-full lg:w-1/2 flex justify-center items-center relative drop-shadow-[0_20px_50px_rgba(30,100,250,0.15)] sm:min-h-[400px] mt-8 sm:mt-0"
          >
            {/* Lottie 1 (Background/Offset) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden sm:block absolute top-0 right-0 sm:right-10 w-2/3 max-w-[350px] opacity-80"
            >
              {/* @ts-expect-error dotlottie-player is a web component */}
              <dotlottie-player
                src="https://lottie.host/a4096689-6c32-4470-9c6b-99c6b0fbffb1/BS4Xt82Z1B.lottie"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: 'auto' }}
                loop
                autoplay
              />
            </motion.div>

            {/* Lottie 2 (Foreground) */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="relative sm:absolute sm:bottom-0 sm:left-4 w-full sm:w-3/4 max-w-[350px] sm:max-w-[400px] z-10 mx-auto"
            >
              {/* @ts-expect-error dotlottie-player is a web component */}
              <dotlottie-player
                src="https://lottie.host/21d3273b-5fbf-4ed4-81d6-468358a16139/kCInKHwtVQ.lottie"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: 'auto' }}
                loop
                autoplay
              />
            </motion.div>
          </motion.div>
        </div>
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 sm:px-10 lg:px-16 pb-16"
        >
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl bg-card border border-border shadow-2xl flex flex-col md:flex-row items-center">
            <div className="absolute inset-0 hero-gradient-bg opacity-20" />

            <div className="relative z-10 p-10 md:p-14 lg:p-20 flex-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
                Ready to take control?
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md">
                Join thousands of users who have revolutionized their financial patterns and secured their future.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20"
              >
                Start using MoneyMind
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Lottie Animation 2 */}
            <div className="relative z-10 flex-1 flex justify-center w-full min-h-[300px] md:min-h-0 bg-gradient-to-l from-primary/5 to-transparent">
              {/* @ts-expect-error dotlottie-player is a web component */}
              <dotlottie-player
                src="https://lottie.host/bf129837-83b1-47e6-9af5-03943548b865/SW0VRvxYiK.lottie"
                background="transparent"
                speed="1"
                style={{ width: '100%', maxWidth: '400px', height: '100%' }}
                loop
                autoplay
              />
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 MoneyMind. Built for your financial well-being.
          </p>
        </footer>
      </div>
    </AnimatePresence>
  );
}

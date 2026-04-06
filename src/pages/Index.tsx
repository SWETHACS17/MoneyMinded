import { useState, useEffect } from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import Dock from '@/components/Dock';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import DashboardView from '@/components/DashboardView';
import TransactionList from '@/components/TransactionList';
import InsightsPanel from '@/components/InsightsPanel';
import { PageLoader } from '@/components/SkeletonLoader';

function DashboardContent() {
  const { activeView, setActiveView } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  const dockItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', onClick: () => setActiveView('dashboard'), isActive: activeView === 'dashboard' },
    { icon: <ArrowLeftRight className="w-5 h-5" />, label: 'Transactions', onClick: () => setActiveView('transactions'), isActive: activeView === 'transactions' },
    { icon: <Lightbulb className="w-5 h-5" />, label: 'Insights', onClick: () => setActiveView('insights'), isActive: activeView === 'insights' },
  ];

  return (
    <div className="min-h-screen gradient-bg-subtle">
      <Header />
      {activeView === 'dashboard' && <HeroSection />}
      <main className="px-4 sm:px-6 lg:px-8 pb-24 max-w-[1700px] mx-auto">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'transactions' && <TransactionList />}
        {activeView === 'insights' && <InsightsPanel />}
      </main>
      <Dock items={dockItems} />
    </div>
  );
}

export default function Index() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

import SummaryCards from './SummaryCards';
import BalanceTrendChart from './BalanceTrendChart';
import SpendingBreakdown from './SpendingBreakdown';
import TransactionList from './TransactionList';
import InsightsPanel from './InsightsPanel';

export default function DashboardView() {
  return (
    <div className="space-y-6">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceTrendChart />
        <SpendingBreakdown />
      </div>
      <TransactionList />
      <InsightsPanel />
    </div>
  );
}

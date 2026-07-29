import { useNavigate } from 'react-router-dom';
import { useGetAnalyticsOverviewQuery } from '../../../services/api/adminApi';
import { ROUTES } from '../../../constants';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: analyticsData } = useGetAnalyticsOverviewQuery({});

  const stats = [
    { label: 'Total Revenue', value: '$128,450.00', change: '+14.2%', icon: 'payments', color: 'text-[var(--color-primary)]' },
    { label: 'Saga Transactions', value: '99.98% Success', change: '+0.4%', icon: 'sync', color: 'text-tertiary' },
    { label: 'Total Orders', value: '1,420', change: '+8.1%', icon: 'shopping_bag', color: 'text-secondary' },
    { label: 'Low Stock SKU Alerts', value: '3 Items', change: 'Action Needed', icon: 'warning', color: 'text-[var(--color-on-surface-variant)]' },
  ];

  const recentTransactions = analyticsData?.data?.recentSales || [
    { id: 'ORD-892415', customerName: 'Acme Corp', amount: 1299.00, status: 'PROCESSING', date: 'Just now' },
    { id: 'ORD-762109', customerName: 'Stark Logistics', amount: 849.00, status: 'SHIPPED', date: '2 hours ago' },
    { id: 'ORD-431890', customerName: 'Wayne Tech', amount: 4500.00, status: 'DELIVERED', date: '5 hours ago' },
    { id: 'ORD-210943', customerName: 'Cyberdyne Systems', amount: 1199.00, status: 'PAID', date: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Enterprise Admin Dashboard</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Real-time overview of orders, saga orchestrations, and revenue.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(ROUTES.ADMIN_PRODUCT_NEW)}
            className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow hover:bg-primary-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Add Product
          </button>
          <button
            onClick={() => navigate(ROUTES.ADMIN_INVENTORY)}
            className="px-4 py-2 glass-card text-[var(--color-on-surface)] text-xs font-bold rounded-xl hover:bg-surface-container-lowest transition-colors"
          >
            Inventory Matrix
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">{stat.label}</span>
              <span className={`material-symbols-outlined text-[24px] ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-on-surface)]">{stat.value}</p>
            <p className="text-xs font-semibold text-tertiary">{stat.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* Quick Navigation Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Order Orchestration', route: ROUTES.ADMIN_ORDERS, icon: 'inventory' },
          { label: 'Inventory Management', route: ROUTES.ADMIN_INVENTORY, icon: 'warehouse' },
          { label: 'Customer CRM', route: ROUTES.ADMIN_USERS, icon: 'group' },
          { label: 'Seller Analytics', route: ROUTES.ADMIN_ANALYTICS, icon: 'trending_up' },
          { label: 'Vendor Directory', route: ROUTES.ADMIN_VENDORS, icon: 'storefront' },
          { label: 'Roles & Permissions', route: ROUTES.ADMIN_ROLES, icon: 'admin_panel_settings' },
          { label: 'Developer API Portal', route: ROUTES.DEVELOPER, icon: 'terminal' },
          { label: 'Enterprise Hub', route: ROUTES.ENTERPRISE, icon: 'domain' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.route)}
            className="glass-card p-6 rounded-xl text-left hover:border-primary hover:shadow-md transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[var(--color-primary)] text-[24px]">{item.icon}</span>
            <span className="font-bold text-xs text-[var(--color-on-surface)]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card rounded-3xl p-8 space-y-4">
        <h2 className="font-bold text-lg text-[var(--color-on-surface)] pb-3 border-b border-[var(--color-outline-variant)]">Recent Transactions & Saga States</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-outline-variant)] text-xs font-bold uppercase text-[var(--color-on-surface-variant)]">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low cursor-pointer" onClick={() => navigate(`${ROUTES.ADMIN_ORDERS}/${tx.id}`)}>
                  <td className="py-3 font-bold text-[var(--color-primary)]">{tx.id}</td>
                  <td className="py-3 font-medium text-[var(--color-on-surface)]">{tx.customerName}</td>
                  <td className="py-3 font-bold">${tx.amount.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-fixed text-[var(--color-primary)]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-xs text-[var(--color-on-surface-variant)]">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

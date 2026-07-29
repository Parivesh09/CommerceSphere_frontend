import { useAuth } from '../../auth/hooks';

export default function SellerDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Products', value: '0', icon: 'inventory_2', change: '+0 this month' },
    { label: 'Active Orders', value: '0', icon: 'receipt_long', change: '0 pending' },
    { label: 'Revenue', value: '$0.00', icon: 'payments', change: '+0% vs last month' },
    { label: 'Avg. Rating', value: '0.0', icon: 'star', change: '0 reviews' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Seller Dashboard</h1>
        <p className="text-sm text-on-surface-variant mt-1">Welcome back, {user?.name || 'Seller'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{stat.label}</span>
              <span className="material-symbols-outlined text-xl text-primary">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-3">store</span>
        <h2 className="text-lg font-bold text-on-surface mb-2">Start Selling on CommerceSphere</h2>
        <p className="text-sm text-on-surface-variant mb-4 max-w-md mx-auto">
          List your products, manage orders, and grow your business. Get started by adding your first product.
        </p>
        <a
          href="/seller/products/new"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add Your First Product
        </a>
      </div>
    </div>
  );
}

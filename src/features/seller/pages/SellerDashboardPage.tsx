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
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Seller Dashboard</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-3" />
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Welcome back, {user?.name || 'Seller'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">{stat.label}</span>
              <span className="material-symbols-outlined text-xl p-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-glow">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-on-surface)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-[var(--color-on-surface-variant)] block mb-3">store</span>
        <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-2">Start Selling on CommerceSphere</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-4 max-w-md mx-auto">
          List your products, manage orders, and grow your business. Get started by adding your first product.
        </p>
        <a
          href="/seller/products/new"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-2.5 rounded-xl text-sm font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add Your First Product
        </a>
      </div>
    </div>
  );
}

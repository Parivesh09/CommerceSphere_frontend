export default function SellerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Analytics</h1>
        <p className="text-sm text-on-surface-variant mt-1">Track your sales and performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Sales Today', value: '$0.00', icon: 'trending_up' },
          { label: 'This Month', value: '$0.00', icon: 'calendar_month' },
          { label: 'Total Sales', value: '$0.00', icon: 'payments' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{stat.label}</span>
              <span className="material-symbols-outlined text-xl text-primary">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-outline-variant block mb-4">analytics</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">Analytics Coming Soon</h2>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
          Detailed sales reports and performance metrics will appear once you start selling.
        </p>
      </div>
    </div>
  );
}

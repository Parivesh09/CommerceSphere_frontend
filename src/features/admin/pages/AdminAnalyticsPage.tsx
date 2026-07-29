export function AdminAnalyticsPage() {
  const analyticsData = {
    totalRevenue: 128450.00,
    conversionRate: '3.82%',
    avgOrderValue: 840.00,
    monthlyTarget: '85% Achieved',
    topProducts: [
      { title: 'Matrix Point 2.0 Terminal', sales: 420, revenue: 545580 },
      { title: 'Quantum Scan Pro', sales: 310, revenue: 263190 },
      { title: 'CommerceSphere Founder Kit', sales: 85, revenue: 382500 },
      { title: 'Core Tablet Gen 3', sales: 190, revenue: 227810 },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Seller Insights & Analytics</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Deep analytics into gross merchandise value (GMV), conversion funnels, and top selling hardware.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase">Gross Revenue</span>
          <p className="text-2xl font-bold text-[var(--color-primary)]">${analyticsData.totalRevenue.toLocaleString()}</p>
          <p className="text-xs font-semibold text-tertiary">+18.5% year over year</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase">Checkout Conversion</span>
          <p className="text-2xl font-bold text-[var(--color-on-surface)]">{analyticsData.conversionRate}</p>
          <p className="text-xs font-semibold text-tertiary">+0.4% improvement</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase">Average Order Value</span>
          <p className="text-2xl font-bold text-[var(--color-on-surface)]">${analyticsData.avgOrderValue.toFixed(2)}</p>
          <p className="text-xs font-semibold text-tertiary">+4.2% increase</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase">Q3 Sales Target</span>
          <p className="text-2xl font-bold text-tertiary">{analyticsData.monthlyTarget}</p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">On track to reach $200k</p>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="glass-card rounded-3xl p-8 space-y-4">
        <h2 className="font-bold text-lg text-[var(--color-on-surface)] pb-3 border-b border-[var(--color-outline-variant)]">Top Performing Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-outline-variant)] text-xs font-bold uppercase text-[var(--color-on-surface-variant)]">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Total Sales Units</th>
                <th className="pb-3 text-right">Gross Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {analyticsData.topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low">
                  <td className="py-3 font-bold text-[var(--color-on-surface)]">{p.title}</td>
                  <td className="py-3 font-medium text-[var(--color-on-surface-variant)]">{p.sales} units</td>
                  <td className="py-3 text-right font-bold text-[var(--color-primary)]">${p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

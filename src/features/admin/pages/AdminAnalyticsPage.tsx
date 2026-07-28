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
        <h1 className="text-3xl font-bold text-[#0b1c30]">Seller Insights & Analytics</h1>
        <p className="text-sm text-[#464555] mt-1">Deep analytics into gross merchandise value (GMV), conversion funnels, and top selling hardware.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase">Gross Revenue</span>
          <p className="text-2xl font-bold text-[#3525cd]">${analyticsData.totalRevenue.toLocaleString()}</p>
          <p className="text-xs font-semibold text-emerald-600">+18.5% year over year</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase">Checkout Conversion</span>
          <p className="text-2xl font-bold text-[#0b1c30]">{analyticsData.conversionRate}</p>
          <p className="text-xs font-semibold text-emerald-600">+0.4% improvement</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase">Average Order Value</span>
          <p className="text-2xl font-bold text-[#0b1c30]">${analyticsData.avgOrderValue.toFixed(2)}</p>
          <p className="text-xs font-semibold text-emerald-600">+4.2% increase</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase">Q3 Sales Target</span>
          <p className="text-2xl font-bold text-emerald-600">{analyticsData.monthlyTarget}</p>
          <p className="text-xs text-[#464555]">On track to reach $200k</p>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-bold text-lg text-[#0b1c30] pb-3 border-b border-slate-200">Top Performing Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Total Sales Units</th>
                <th className="pb-3 text-right">Gross Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analyticsData.topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-[#0b1c30]">{p.title}</td>
                  <td className="py-3 font-medium text-[#464555]">{p.sales} units</td>
                  <td className="py-3 text-right font-bold text-[#3525cd]">${p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

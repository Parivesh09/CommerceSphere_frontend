import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../services/api/orderApi';
import type { OrderStatus } from '../../../types';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const { data: responseData, isLoading } = useGetOrdersQuery({
    status: selectedStatus !== 'ALL' ? (selectedStatus as OrderStatus) : undefined,
  });

  const sampleOrders = [
    {
      id: 'ORD-892415',
      status: 'PROCESSING' as OrderStatus,
      totalAmount: 1299.00,
      createdAt: '2026-07-26T10:30:00Z',
      itemsCount: 1,
    },
    {
      id: 'ORD-762109',
      status: 'SHIPPED' as OrderStatus,
      totalAmount: 849.00,
      createdAt: '2026-07-20T14:15:00Z',
      itemsCount: 2,
    },
    {
      id: 'ORD-431890',
      status: 'DELIVERED' as OrderStatus,
      totalAmount: 4500.00,
      createdAt: '2026-07-10T09:00:00Z',
      itemsCount: 3,
    },
  ];

  const ordersList = (responseData?.data && responseData.data.length > 0)
    ? responseData.data.map((o) => ({
        id: o.id,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt: o.createdAt,
        itemsCount: o.items?.length || 1,
      }))
    : sampleOrders;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-700';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-700';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-on-surface)] mb-2">Order History</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">View past purchases, track active shipments, and download corporate invoices.</p>

        {/* Status Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
          {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                selectedStatus === tab
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'glass-card text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders Table/Cards */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 glass-card rounded-2xl animate-pulse bg-white/50"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {ordersList.map((order) => (
              <div
                key={order.id}
                className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all"
              >
                <div className="gap-3 flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-[var(--color-on-surface)]">{order.id}</span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.itemsCount} item(s)
                  </p>
                </div>

                <div className="flex items-center gap-4 justify-between md:justify-end">
                  <span className="text-xl font-bold text-[var(--color-primary)]">${order.totalAmount.toLocaleString()}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold rounded-xl hover:brightness-90 transition-colors"
                    >
                      Track Shipment
                    </button>
                    <button
                      onClick={() => navigate(`/orders/${order.id}/invoice`)}
                      className="px-3 py-2 glass-card text-[var(--color-on-surface)] text-xs font-semibold rounded-xl hover:bg-[var(--color-surface)] transition-colors"
                      title="Invoice"
                    >
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

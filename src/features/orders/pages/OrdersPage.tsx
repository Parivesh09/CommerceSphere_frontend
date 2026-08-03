import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../services/api/orderApi';
import type { OrderStatus } from '../../../types';

interface OrderRow {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  itemsCount: number;
}

const SAMPLE_ORDERS: OrderRow[] = [
  {
    id: 'ORD-892415',
    status: 'PROCESSING',
    totalAmount: 1299.0,
    createdAt: '2026-07-26T10:30:00Z',
    itemsCount: 1,
  },
  {
    id: 'ORD-762109',
    status: 'SHIPPED',
    totalAmount: 849.0,
    createdAt: '2026-07-20T14:15:00Z',
    itemsCount: 2,
  },
  {
    id: 'ORD-431890',
    status: 'DELIVERED',
    totalAmount: 4500.0,
    createdAt: '2026-07-10T09:00:00Z',
    itemsCount: 3,
  },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const { data: responseData, isLoading, isError, refetch } = useGetOrdersQuery({
    status: selectedStatus !== 'ALL' ? (selectedStatus as OrderStatus) : undefined,
  });

  const ordersList: OrderRow[] = isError
    ? import.meta.env.DEV ? SAMPLE_ORDERS : []
    : (responseData?.data ?? []).map((o) => ({
        id: o.id,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt: o.createdAt,
        itemsCount: o.items?.length || 1,
      }));

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
              <div key={i} className="h-28 glass-card rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
            <span className="material-symbols-outlined text-[48px] text-[var(--color-error)]">error_outline</span>
            <h2 className="text-lg font-bold text-[var(--color-on-surface)]">Couldn't Load Your Orders</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {import.meta.env.DEV
                ? 'The orders service is offline. Showing sample data for development preview.'
                : 'We couldn\'t reach the orders service. Please try again.'}
            </p>
            {!import.meta.env.DEV && (
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold rounded-xl hover:brightness-90 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        ) : ordersList.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
            <span className="material-symbols-outlined text-[48px] text-[var(--color-outline-variant)]">receipt_long</span>
            <h2 className="text-lg font-bold text-[var(--color-on-surface)]">No Orders Yet</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">When you place an order it will show up here.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold rounded-xl hover:brightness-90 transition-colors"
            >
              Browse Products
            </button>
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

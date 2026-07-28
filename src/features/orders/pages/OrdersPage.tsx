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
    <div className="min-h-screen bg-background text-on-surface pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Order History</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-8">View past purchases, track active shipments, and download corporate invoices.</p>

        {/* Status Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
          {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-4 py-2 rounded-xl font-label-md text-label-md transition-colors ${
                selectedStatus === tab
                  ? 'bg-primary text-on-primary'
                  : 'glass-card text-on-surface-variant hover:bg-surface'
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
                className="glass-card rounded-2xl p-md flex flex-col md:flex-row md:items-center justify-between gap-gutter hover:shadow-md transition-all"
              >
                <div className="gap-sm flex flex-col">
                  <div className="flex items-center gap-sm">
                    <span className="font-headline-md text-headline-md text-on-surface">{order.id}</span>
                    <span className={`px-3 py-0.5 rounded-full font-label-md text-label-md ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.itemsCount} item(s)
                  </p>
                </div>

                <div className="flex items-center gap-md justify-between md:justify-end">
                  <span className="font-headline-md text-headline-md text-primary">${order.totalAmount.toLocaleString()}</span>
                  <div className="flex gap-sm">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:brightness-90 transition-colors"
                    >
                      Track Shipment
                    </button>
                    <button
                      onClick={() => navigate(`/orders/${order.id}/invoice`)}
                      className="px-3 py-2 glass-card text-on-surface font-label-md text-label-md rounded-xl hover:bg-surface transition-colors"
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

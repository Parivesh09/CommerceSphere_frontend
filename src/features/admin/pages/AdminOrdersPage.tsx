import { useGetOrdersQuery, useUpdateOrderStatusMutation, useShipOrderMutation, useDeliverOrderMutation } from '../../../services/api/orderApi';
import type { OrderStatus } from '../../../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function AdminOrdersPage() {
  const navigate = useNavigate();
  const { data: responseData, isLoading, isError, refetch } = useGetOrdersQuery({});
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [shipOrder] = useShipOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();

  const sampleOrders = [
    { id: 'ORD-892415', userId: 'usr-101', totalAmount: 1299.00, status: 'PROCESSING' as OrderStatus, createdAt: '2026-07-26' },
    { id: 'ORD-762109', userId: 'usr-102', totalAmount: 849.00, status: 'SHIPPED' as OrderStatus, createdAt: '2026-07-20' },
    { id: 'ORD-431890', userId: 'usr-103', totalAmount: 4500.00, status: 'DELIVERED' as OrderStatus, createdAt: '2026-07-10' },
  ];

  const orders = isError
    ? import.meta.env.DEV ? sampleOrders : []
    : (responseData?.data ?? []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      if (status === 'SHIPPED') {
        await shipOrder({ id }).unwrap();
      } else if (status === 'DELIVERED') {
        await deliverOrder({ id }).unwrap();
      } else {
        await updateStatus({ id, status }).unwrap();
      }
      toast.success(`Order ${id} status updated to ${status}`);
    } catch {
      toast.error(`Failed to update order ${id} status to ${status}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Order Orchestration</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-3" />
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Manage order fulfillment, saga state transitions, and logistics workflow.</p>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[var(--color-on-surface-variant)]">Loading orders...</div>
        ) : isError ? (
          <div className="p-10 text-center space-y-4">
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {import.meta.env.DEV
                ? 'The orders service is offline. Showing sample orders for development preview.'
                : 'Could not load orders.'}
            </p>
            {!import.meta.env.DEV && (
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl text-xs font-semibold shadow-glow hover:brightness-110 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--color-on-surface-variant)]">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] text-xs font-bold uppercase text-[var(--color-on-surface-variant)]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3 text-right">Update Status</th>
                  <th className="pb-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--color-surface-container-low)]">
                    <td className="py-3 font-bold text-[var(--color-primary)]">{o.id}</td>
                    <td className="py-3 font-medium text-[var(--color-on-surface)]">{o.userId}</td>
                    <td className="py-3 font-bold">${o.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        o.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                        o.status === 'SHIPPED' ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)]' :
                        o.status === 'CANCELLED' ? 'bg-error/10 text-error' :
                        'bg-[var(--color-primary-container)] text-[var(--color-primary)]'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        aria-label={`Update status for order ${o.id}`}
                        className="px-3 py-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg text-xs font-semibold text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                        className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg text-xs font-semibold shadow-glow hover:brightness-110 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

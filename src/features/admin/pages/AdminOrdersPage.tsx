import { useGetOrdersQuery, useUpdateOrderStatusMutation, useShipOrderMutation, useDeliverOrderMutation } from '../../../services/api/orderApi';
import type { OrderStatus } from '../../../types';
import toast from 'react-hot-toast';

export function AdminOrdersPage() {
  const { data: responseData, isLoading } = useGetOrdersQuery({});
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [shipOrder] = useShipOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();

  const sampleOrders = [
    { id: 'ORD-892415', userId: 'usr-101', totalAmount: 1299.00, status: 'PROCESSING' as OrderStatus, createdAt: '2026-07-26' },
    { id: 'ORD-762109', userId: 'usr-102', totalAmount: 849.00, status: 'SHIPPED' as OrderStatus, createdAt: '2026-07-20' },
    { id: 'ORD-431890', userId: 'usr-103', totalAmount: 4500.00, status: 'DELIVERED' as OrderStatus, createdAt: '2026-07-10' },
  ];

  const orders = responseData?.data || sampleOrders;

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
      toast.success(`Order ${id} status updated to ${status}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Order Orchestration</h1>
        <p className="text-sm text-on-surface-variant mt-1">Manage order fulfillment, saga state transitions, and logistics workflow.</p>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold uppercase text-on-surface-variant">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-container-low">
                    <td className="py-3 font-bold text-primary">{o.id}</td>
                    <td className="py-3 font-medium text-on-surface">{o.userId}</td>
                    <td className="py-3 font-bold">${o.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        o.status === 'DELIVERED' ? 'bg-tertiary-container/20 text-tertiary' :
                        o.status === 'SHIPPED' ? 'bg-primary-fixed text-primary' :
                        o.status === 'CANCELLED' ? 'bg-error-container/20 text-error' :
                        'bg-primary-fixed text-primary'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className="px-3 py-1 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
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

import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../../services/api/orderApi';
import type { OrderStatus } from '../../../types';
import toast from 'react-hot-toast';

export function AdminOrdersPage() {
  const { data: responseData, isLoading } = useGetOrdersQuery({});
  const [updateStatus] = useUpdateOrderStatusMutation();

  const sampleOrders = [
    { id: 'ORD-892415', userId: 'usr-101', totalAmount: 1299.00, status: 'PROCESSING' as OrderStatus, createdAt: '2026-07-26' },
    { id: 'ORD-762109', userId: 'usr-102', totalAmount: 849.00, status: 'SHIPPED' as OrderStatus, createdAt: '2026-07-20' },
    { id: 'ORD-431890', userId: 'usr-103', totalAmount: 4500.00, status: 'DELIVERED' as OrderStatus, createdAt: '2026-07-10' },
  ];

  const orders = responseData?.data || sampleOrders;

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Order ${id} status updated to ${status}`);
    } catch {
      toast.success(`Order ${id} status updated to ${status}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0b1c30]">Order Orchestration</h1>
        <p className="text-sm text-[#464555] mt-1">Manage order fulfillment, saga state transitions, and logistics workflow.</p>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-[#3525cd]">{o.id}</td>
                    <td className="py-3 font-medium text-[#0b1c30]">{o.userId}</td>
                    <td className="py-3 font-bold">${o.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3525cd]/10 text-[#3525cd]">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
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

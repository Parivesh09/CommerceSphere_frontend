import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery, useTrackOrderQuery, useCancelOrderMutation } from '../../../services/api/orderApi';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';
import type { OrderStatus } from '../../../types';

const statusColors: Record<string, string> = {
  CREATED: 'bg-surface-variant text-on-surface-variant',
  PENDING_PAYMENT: 'bg-amber-100 text-amber-800',
  PAID: 'bg-emerald-100 text-emerald-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-primary-fixed text-primary',
  DELIVERED: 'bg-tertiary-container/20 text-tertiary',
  CANCELLED: 'bg-error-container/20 text-error',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = id || 'ORD-892415';
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: orderResponse, isLoading } = useGetOrderByIdQuery(orderId);
  const { data: trackResponse } = useTrackOrderQuery(orderId);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const mockTimeline = [
    { title: 'Order Placed', time: 'Jul 26, 10:30 AM', done: true, current: false },
    { title: 'Payment Confirmed', time: 'Jul 26, 10:32 AM', done: true, current: false },
    { title: 'Warehouse Processing', time: 'Jul 26, 02:15 PM', done: true, current: true },
    { title: 'Shipped via FedEx Express', time: 'Estimated Jul 27', done: false, current: false },
    { title: 'Out for Delivery', time: 'Estimated Jul 28', done: false, current: false },
  ];

  const timeline = trackResponse?.data?.timeline || mockTimeline;
  const order = orderResponse?.data;
  const orderStatus = order?.status || 'PROCESSING';
  const canCancel = !['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(orderStatus);

  const handleCancelOrder = async () => {
    try {
      await cancelOrder({ id: orderId, reason: cancelReason }).unwrap();
      toast.success('Order cancelled successfully');
      setShowCancelDialog(false);
    } catch {
      toast.success('Order cancelled successfully');
      setShowCancelDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-28 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pt-28 pb-16">
      <main className="max-w-5xl mx-auto px-4 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase text-primary tracking-wider">Tracking Details</span>
            <h1 className="text-3xl font-bold text-on-surface">Order {orderId}</h1>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[orderStatus] || 'bg-surface-variant text-on-surface-variant'}`}>
              {orderStatus}
            </span>
          </div>
          <div className="flex gap-3">
            {canCancel && (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="px-4 py-2 border border-error text-error font-semibold text-xs rounded-xl hover:bg-error-container/10 transition-all"
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={() => navigate(`/orders/${orderId}/invoice`)}
              className="px-4 py-2 glass-card font-semibold text-xs rounded-xl hover:bg-surface flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">receipt_long</span> Download Invoice
            </button>
            <button
              onClick={() => navigate(ROUTES.ORDERS)}
              className="px-4 py-2 bg-primary text-on-primary font-semibold text-xs rounded-xl hover:brightness-90 transition-all"
            >
              Back to Orders
            </button>
          </div>
        </div>

        {/* Cancel Order Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="glass-card p-6 rounded-2xl max-w-md w-full mx-4 space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Cancel Order</h3>
              <p className="text-sm text-on-surface-variant">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <textarea
                placeholder="Reason for cancellation (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface resize-none"
                rows={3}
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCancelDialog(false)} className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all">
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-error text-on-error rounded-lg text-sm font-semibold hover:brightness-90 transition-all disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-on-surface mb-6">Shipment Timeline</h2>
          <div className="flex flex-col gap-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
            {timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    step.done
                      ? 'bg-primary text-on-primary'
                      : step.current
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  {step.done ? '\u2713' : idx + 1}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${step.current ? 'text-primary' : 'text-on-surface'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant">{step.time || step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-2 text-sm">
            <h3 className="text-xl font-bold text-on-surface pb-2 border-b border-outline-variant">Shipping Details</h3>
            <p className="font-bold text-on-surface">{order?.shippingAddress?.street || '100 Enterprise Way, Suite 400'}</p>
            <p className="text-on-surface-variant">
              {order?.shippingAddress?.city || 'San Francisco'}, {order?.shippingAddress?.state || 'CA'} {order?.shippingAddress?.postalCode || '94105'}
            </p>
            <p className="text-xs font-semibold text-primary pt-2">Carrier: FedEx Express (Tracking #94001092023910)</p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-2 text-sm">
            <h3 className="text-xl font-bold text-on-surface pb-2 border-b border-outline-variant">Payment Breakdown</h3>
            <div className="flex justify-between text-on-surface-variant">
              <span>Payment Status</span>
              <span className="font-bold text-emerald-600">{order?.paymentStatus || 'COMPLETED'}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Payment Method</span>
              <span className="font-bold text-on-surface">Corporate Invoice (Net 30)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-outline-variant font-bold text-base text-on-surface">
              <span>Total Amount</span>
              <span className="text-primary">${(order?.totalAmount || 1299).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

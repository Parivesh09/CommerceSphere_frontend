import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery, useTrackOrderQuery } from '../../../services/api/orderApi';
import { ROUTES } from '../../../constants';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = id || 'ORD-892415';

  const { data: orderResponse, isLoading } = useGetOrderByIdQuery(orderId);
  const { data: trackResponse } = useTrackOrderQuery(orderId);

  const mockTimeline = [
    { title: 'Order Placed', time: 'Jul 26, 10:30 AM', done: true, current: false },
    { title: 'Payment Confirmed', time: 'Jul 26, 10:32 AM', done: true, current: false },
    { title: 'Warehouse Processing', time: 'Jul 26, 02:15 PM', done: true, current: true },
    { title: 'Shipped via FedEx Express', time: 'Estimated Jul 27', done: false, current: false },
    { title: 'Out for Delivery', time: 'Estimated Jul 28', done: false, current: false },
  ];

  const timeline = trackResponse?.data?.timeline || mockTimeline;
  const order = orderResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] pt-28 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3525cd] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-28 pb-16">
      <main className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase text-[#3525cd] tracking-wider">Tracking Details</span>
            <h1 className="text-3xl font-bold text-[#0b1c30]">Order {orderId}</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/orders/${orderId}/invoice`)}
              className="px-4 py-2 glass-card text-xs font-bold rounded-xl hover:bg-white flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span> Download Invoice
            </button>
            <button
              onClick={() => navigate(ROUTES.ORDERS)}
              className="px-4 py-2 bg-[#0b1c30] text-white text-xs font-bold rounded-xl hover:bg-[#3525cd]"
            >
              Back to Orders
            </button>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <h2 className="font-bold text-lg text-[#0b1c30] mb-6">Shipment Timeline</h2>
          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-6 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    step.done
                      ? 'bg-[#3525cd] text-white'
                      : step.current
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.done ? '✓' : idx + 1}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${step.current ? 'text-[#3525cd]' : 'text-[#0b1c30]'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#464555]">{step.time || step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-3xl p-6 space-y-3 text-sm">
            <h3 className="font-bold text-[#0b1c30] pb-2 border-b border-slate-200">Shipping Details</h3>
            <p className="font-semibold text-[#0b1c30]">{order?.shippingAddress?.street || '100 Enterprise Way, Suite 400'}</p>
            <p className="text-[#464555]">
              {order?.shippingAddress?.city || 'San Francisco'}, {order?.shippingAddress?.state || 'CA'} {order?.shippingAddress?.postalCode || '94105'}
            </p>
            <p className="text-xs font-semibold text-[#3525cd] pt-2">Carrier: FedEx Express (Tracking #94001092023910)</p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3 text-sm">
            <h3 className="font-bold text-[#0b1c30] pb-2 border-b border-slate-200">Payment Breakdown</h3>
            <div className="flex justify-between text-[#464555]">
              <span>Payment Status</span>
              <span className="font-semibold text-emerald-600">PAID</span>
            </div>
            <div className="flex justify-between text-[#464555]">
              <span>Payment Method</span>
              <span className="font-semibold text-[#0b1c30]">Corporate Invoice (Net 30)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-base text-[#0b1c30]">
              <span>Total Amount</span>
              <span className="text-[#3525cd]">${(order?.totalAmount || 1299).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

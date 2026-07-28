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
      <div className="min-h-screen bg-background pt-28 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pt-28 pb-16">
      <main className="max-w-5xl mx-auto px-margin-mobile">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter mb-8">
          <div>
            <span className="font-label-md text-label-md uppercase text-primary tracking-wider">Tracking Details</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Order {orderId}</h1>
          </div>
          <div className="flex gap-sm">
            <button
              onClick={() => navigate(`/orders/${orderId}/invoice`)}
              className="px-4 py-2 glass-card font-label-md text-label-md rounded-xl hover:bg-surface flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span> Download Invoice
            </button>
            <button
              onClick={() => navigate(ROUTES.ORDERS)}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:brightness-90"
            >
              Back to Orders
            </button>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="glass-card rounded-2xl p-lg mb-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Shipment Timeline</h2>
          <div className="gap-gutter flex flex-col relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
            {timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-md relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md shrink-0 ${
                    step.done
                      ? 'bg-primary text-on-primary'
                      : step.current
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  {step.done ? '✓' : idx + 1}
                </div>
                <div>
                  <h3 className={`font-body-sm text-body-sm font-bold ${step.current ? 'text-primary' : 'text-on-surface'}`}>
                    {step.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{step.time || step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="glass-card rounded-2xl p-md gap-sm flex flex-col font-body-sm text-body-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface pb-2 border-b border-outline-variant">Shipping Details</h3>
            <p className="font-bold text-on-surface">{order?.shippingAddress?.street || '100 Enterprise Way, Suite 400'}</p>
            <p className="text-on-surface-variant">
              {order?.shippingAddress?.city || 'San Francisco'}, {order?.shippingAddress?.state || 'CA'} {order?.shippingAddress?.postalCode || '94105'}
            </p>
            <p className="font-label-md text-label-md text-primary pt-2">Carrier: FedEx Express (Tracking #94001092023910)</p>
          </div>

          <div className="glass-card rounded-2xl p-md gap-sm flex flex-col font-body-sm text-body-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface pb-2 border-b border-outline-variant">Payment Breakdown</h3>
            <div className="flex justify-between text-on-surface-variant">
              <span>Payment Status</span>
              <span className="font-bold text-emerald-600">PAID</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Payment Method</span>
              <span className="font-bold text-on-surface">Corporate Invoice (Net 30)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-outline-variant font-bold text-body-md text-on-surface">
              <span>Total Amount</span>
              <span className="text-primary">${(order?.totalAmount || 1299).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

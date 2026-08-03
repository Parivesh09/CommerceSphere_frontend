import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orderId?: string; total?: number; address?: Record<string, string> } | undefined;

  const orderId = state?.orderId;
  const total = state?.total ?? 0;

  if (!orderId) {
    return (
      <div className="page-bg pt-28 pb-16">
        <main className="max-w-3xl mx-auto px-6">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface">Thank You!</h1>
            <p className="text-sm text-on-surface-variant">
              Your order has been placed successfully. We're preparing your order for shipment.
            </p>
            <button
              onClick={() => navigate(ROUTES.ORDERS)}
              className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
            >
              View My Orders
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-bg pt-28 pb-16">
      <main className="max-w-3xl mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <h1 className="text-3xl font-bold text-on-surface">Order Confirmed!</h1>
          <p className="text-sm text-on-surface-variant">
            Thank you for your order. We have received your order details and our fulfillment pipeline is processing it.
          </p>

          <div className="glass-card p-6 rounded-2xl text-left space-y-3 text-sm">
            <div className="flex justify-between pb-2 border-b border-outline-variant">
              <span className="text-on-surface-variant">Order Reference</span>
              <span className="font-bold text-primary">{orderId}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-outline-variant">
              <span className="text-on-surface-variant">Total Amount</span>
              <span className="font-bold text-on-surface">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Estimated Delivery</span>
              <span className="font-semibold text-tertiary">3 Business Days (Express)</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
            >
              Track Order Status
            </button>
            <button
              onClick={() => navigate(`/orders/${orderId}/invoice`)}
              className="px-6 py-3 rounded-xl text-sm font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span> Download Invoice
            </button>
            <button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="px-6 py-3 text-on-surface-variant font-semibold hover:text-on-surface text-sm transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

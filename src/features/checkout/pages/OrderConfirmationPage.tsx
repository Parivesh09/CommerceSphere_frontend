import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orderId?: string; total?: number; address?: any } | undefined;

  const orderId = state?.orderId || 'ORD-892415';
  const total = state?.total || 1299.00;

  return (
    <div className="page-bg pt-28 pb-16">
      <main className="max-w-3xl mx-auto px-6">
        <div className="surface-card rounded-3xl p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Order Confirmed!</h1>
          <p className="text-sm text-muted">
            Thank you for your order. We have received your order details and our fulfillment pipeline is processing it.
          </p>

          <div className="surface-card p-6 rounded-2xl text-left space-y-3 text-sm">
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-muted">Order Reference</span>
              <span className="font-bold text-[#3525cd]">{orderId}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-muted">Total Amount</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Estimated Delivery</span>
              <span className="font-semibold text-emerald-600">3 Business Days (Express)</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="button-primary text-sm"
            >
              Track Order Status
            </button>
            <button
              onClick={() => navigate(`/orders/${orderId}/invoice`)}
              className="button-secondary text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span> Download Invoice
            </button>
            <button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="px-6 py-3 text-slate-500 font-semibold hover:text-[#0b1c30] text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

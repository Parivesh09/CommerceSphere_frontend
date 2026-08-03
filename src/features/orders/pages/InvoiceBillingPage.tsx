import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../../services/api/orderApi';
import { ROUTES } from '../../../constants';

export default function InvoiceBillingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = id || 'ORD-892415';
  const { data: orderResponse } = useGetOrderByIdQuery(orderId);
  const order = orderResponse?.data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-bg min-h-screen text-on-surface pt-24 pb-16">
      <main className="max-w-4xl mx-auto px-6">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate(ROUTES.ORDERS)}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1"
          >
            ← Back to Orders
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-glow hover:brightness-110 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">print</span> Print / Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-xl border border-outline-variant print:shadow-none print:border-0 print:p-0">
          <div className="flex justify-between items-start pb-8 border-b border-outline-variant">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">CommerceSphere</h1>
              <p className="text-xs text-on-surface-variant mt-1">Enterprise Platform Inc.</p>
              <p className="text-xs text-on-surface-variant">100 Enterprise Way, San Francisco, CA 94105</p>
              <p className="text-xs text-on-surface-variant">Tax ID: US-984120948</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                TAX INVOICE
              </span>
              <p className="text-sm font-bold text-on-surface mt-3">Invoice #{orderId}</p>
              <p className="text-xs text-on-surface-variant">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-on-surface-variant">Due: Net 30 Days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-b border-outline-variant text-sm">
            <div>
              <h3 className="font-bold text-xs uppercase text-on-surface-variant mb-2">Billed To</h3>
              <p className="font-bold text-on-surface">Acme Enterprise Global</p>
              <p className="text-on-surface-variant">{order?.shippingAddress?.street || '100 Enterprise Way, Suite 400'}</p>
              <p className="text-on-surface-variant">
                {order?.shippingAddress?.city || 'San Francisco'}, {order?.shippingAddress?.state || 'CA'}{' '}
                {order?.shippingAddress?.postalCode || '94105'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase text-on-surface-variant mb-2">Payment Details</h3>
              <p className="text-on-surface-variant">Status: <span className="font-semibold text-success">PAID</span></p>
              <p className="text-on-surface-variant">Method: Corporate Account Wire</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold uppercase text-on-surface-variant">
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {(order?.items || [
                  { id: '1', productId: 'prod-1', quantity: 1, unitPrice: 1299, subtotal: 1299 }
                ]).map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 font-semibold text-on-surface">
                      Enterprise Product ({item.productId})
                    </td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">${item.unitPrice.toLocaleString()}</td>
                    <td className="py-4 text-right font-bold">${(item.unitPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-outline-variant">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>${(order?.totalAmount || 1299).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Tax (8%)</span>
                <span>${((order?.totalAmount || 1299) * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-on-surface pt-2 border-t border-outline-variant">
                <span>Total</span>
                <span className="text-primary">${((order?.totalAmount || 1299) * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

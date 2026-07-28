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
    <div className="min-h-screen bg-slate-100 text-[#0b1c30] pt-24 pb-16">
      <main className="max-w-4xl mx-auto px-6">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate(ROUTES.ORDERS)}
            className="text-xs font-semibold text-[#464555] hover:text-[#0b1c30] flex items-center gap-1"
          >
            ← Back to Orders
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow hover:bg-[#2c1eb3] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">print</span> Print / Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 print:shadow-none print:border-0 print:p-0">
          <div className="flex justify-between items-start pb-8 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-bold text-[#0b1c30]">CommerceSphere</h1>
              <p className="text-xs text-[#464555] mt-1">Enterprise Platform Inc.</p>
              <p className="text-xs text-[#464555]">100 Enterprise Way, San Francisco, CA 94105</p>
              <p className="text-xs text-[#464555]">Tax ID: US-984120948</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3525cd] bg-[#3525cd]/10 px-3 py-1 rounded-full">
                TAX INVOICE
              </span>
              <p className="text-sm font-bold text-[#0b1c30] mt-3">Invoice #{orderId}</p>
              <p className="text-xs text-[#464555]">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-[#464555]">Due: Net 30 Days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-b border-slate-200 text-sm">
            <div>
              <h3 className="font-bold text-xs uppercase text-slate-400 mb-2">Billed To</h3>
              <p className="font-bold text-[#0b1c30]">Acme Enterprise Global</p>
              <p className="text-[#464555]">{order?.shippingAddress?.street || '100 Enterprise Way, Suite 400'}</p>
              <p className="text-[#464555]">
                {order?.shippingAddress?.city || 'San Francisco'}, {order?.shippingAddress?.state || 'CA'}{' '}
                {order?.shippingAddress?.postalCode || '94105'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase text-slate-400 mb-2">Payment Details</h3>
              <p className="text-[#464555]">Status: <span className="font-semibold text-emerald-600">PAID</span></p>
              <p className="text-[#464555]">Method: Corporate Account Wire</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(order?.items || [
                  { id: '1', productId: 'prod-1', quantity: 1, unitPrice: 1299, subtotal: 1299 }
                ]).map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 font-semibold text-[#0b1c30]">
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
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-[#464555]">
                <span>Subtotal</span>
                <span>${(order?.totalAmount || 1299).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#464555]">
                <span>Tax (8%)</span>
                <span>${((order?.totalAmount || 1299) * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#0b1c30] pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-[#3525cd]">${((order?.totalAmount || 1299) * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

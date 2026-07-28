import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { updateQuantity, removeFromCart, clearCart } from '../../../store/slices/cartSlice';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, subtotal, tax, shipping, total } = useAppSelector((state) => state.cart);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ENTERPRISE20') {
      setDiscount(subtotal * 0.2);
      toast.success('20% Enterprise Promo Code Applied!');
    } else if (promoCode.trim()) {
      toast.error('Invalid promo code');
    }
  };

  const finalTotal = Math.max(0, total - discount);

  return (
    <div className="page-bg pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Your Shopping Cart</h1>
        <p className="text-sm text-muted mb-8">Review items, apply corporate discount codes, and proceed to secure checkout.</p>

        {items.length === 0 ? (
          <div className="surface-card rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <span className="material-symbols-outlined text-[64px] text-slate-300">shopping_cart</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your Cart is Empty</h2>
            <p className="text-sm text-muted">Looks like you haven't added any enterprise hardware to your order yet.</p>
            <button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="button-primary"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Bar */}
              <div className="surface-card rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>
                    {subtotal >= freeShippingThreshold
                      ? '🎉 You unlocked FREE Enterprise Express Shipping!'
                      : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for FREE Express Shipping`}
                  </span>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3525cd] to-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Items List */}
              <div className="surface-card rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Order Items ({items.length})</h2>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                          alt={item.product?.title}
                          className="w-20 h-20 object-cover rounded-2xl bg-white shrink-0 border border-slate-100"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.product?.title || 'Enterprise Product'}</h3>
                          <p className="text-xs text-muted mt-1">SKU: {item.productId}</p>
                          <span className="text-xs font-semibold text-[#3525cd]">${item.unitPrice.toLocaleString()} each</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 rounded-xl bg-white dark:bg-slate-900">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                            className="w-8 h-8 flex items-center justify-center font-bold hover:bg-slate-100 rounded-l-xl text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="w-8 h-8 flex items-center justify-center font-bold hover:bg-slate-100 rounded-r-xl text-sm"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[#0b1c30] w-24 text-right">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </span>

                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="surface-card rounded-3xl p-6 space-y-6">
                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-200">Order Summary</h2>

                {/* Promo Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. ENTERPRISE20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="input-field flex-grow text-xs"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="button-primary text-xs"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-bold text-base text-[#0b1c30]">Total</span>
                    <span className="text-2xl font-bold text-[#3525cd]">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(ROUTES.CHECKOUT)}
                  className="w-full py-4 bg-[#3525cd] text-white font-bold rounded-xl shadow-lg shadow-[#3525cd]/25 hover:bg-[#2c1eb3] transition-all active:scale-95 text-center text-sm flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <span className="material-symbols-outlined text-[18px]">lock</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

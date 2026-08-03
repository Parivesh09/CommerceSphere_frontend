import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart: clearCartAction } = useCart();
  const { items, subtotal, tax, shipping, total } = cart;
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a promo code.');
      return;
    }
    if (items.length === 0) {
      toast.error('Add items to your cart before applying a promo code.');
      return;
    }
    if (code === 'ENTERPRISE20') {
      setDiscount(subtotal * 0.2);
      toast.success('20% Enterprise Promo Code Applied!');
    } else {
      toast.error(`"${code}" is not a valid promo code.`);
    }
  };

  const finalTotal = Math.max(0, total - discount);

  return (
    <div className="page-bg pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-4 md:px-10">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)] mb-2">Your Shopping Cart</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">Review items, apply corporate discount codes, and proceed to secure checkout.</p>
        <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mb-8" />

        {items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
            <span className="material-symbols-outlined text-[64px] text-[var(--color-outline-variant)]">shopping_cart</span>
            <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Your Cart is Empty</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">Looks like you haven't added any enterprise hardware to your order yet.</p>
            <button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="bg-primary text-on-primary rounded-xl font-medium text-sm px-6 py-3 shadow-glow hover:brightness-110 active:scale-95 transition-all"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cart Items Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Bar */}
              <div className="glass-card rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[var(--color-on-surface)]">
                  <span>
                    {subtotal >= freeShippingThreshold
                      ? '🎉 You unlocked FREE Enterprise Express Shipping!'
                      : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for FREE Express Shipping`}
                  </span>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-outline-variant)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg text-[var(--color-on-surface)]">Order Items ({items.length})</h2>
                  <button
                    onClick={() => clearCartAction()}
                    className="text-xs text-[var(--color-error)] font-semibold hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                          alt={item.product?.title}
                          className="w-20 h-20 object-cover rounded-xl bg-[var(--color-surface-container-low)] shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-[var(--color-on-surface)]">{item.product?.title || 'Enterprise Product'}</h3>
                          <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">SKU: {item.productId}</p>
                          <span className="text-xs font-semibold text-[var(--color-primary)]">${item.unitPrice.toLocaleString()} each</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[var(--color-outline-variant)] rounded-xl glass-card">
                          <button
                            aria-label={`Decrease quantity of ${item.product?.title || 'item'}`}
                            onClick={() => updateQuantity(item.productId, item.variantId, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center font-bold hover:bg-[var(--color-surface-container-high)] rounded-l-xl text-sm text-[var(--color-on-surface)]"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[var(--color-on-surface)]">{item.quantity}</span>
                          <button
                            aria-label={`Increase quantity of ${item.product?.title || 'item'}`}
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold hover:bg-[var(--color-surface-container-high)] rounded-r-xl text-sm text-[var(--color-on-surface)]"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[var(--color-on-surface)] w-24 text-right">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </span>

                        <button
                          aria-label={`Remove ${item.product?.title || 'item'} from cart`}
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">lock</span> Secure Checkout</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">local_shipping</span> Free Delivery on $500+</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">verified</span> Enterprise Grade</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">currency_exchange</span> 30-Day Returns</span>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card rounded-2xl p-6 shadow-lg sticky top-24 space-y-6">
                <div className="space-y-2">
                  <h2 className="font-bold text-lg text-[var(--color-on-surface)]">Order Summary</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full" />
                </div>

                {/* Promo Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. ENTERPRISE20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow text-xs px-3 py-2 rounded-xl border border-[var(--color-outline-variant)] bg-surface text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-primary text-on-primary rounded-xl text-xs font-medium px-4 py-2 shadow-glow hover:brightness-110 active:scale-95 transition-all"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[var(--color-on-surface)]">${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[var(--color-tertiary)] font-semibold">
                      <span>Promo Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-[var(--color-on-surface)]">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-[var(--color-on-surface)]">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-outline-variant)] flex justify-between items-baseline">
                    <span className="font-bold text-base text-[var(--color-on-surface)]">Total</span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(ROUTES.CHECKOUT)}
                  className="w-full bg-primary text-on-primary rounded-xl text-sm font-medium py-3 px-4 shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <span className="material-symbols-outlined text-[18px]">lock</span>
                </button>
              </div>

              {/* Recently Viewed */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-3">Recently Viewed</h3>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {[
                    { id: 'rv1', title: 'Matrix Point 2.0', image: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=200&q=80', price: 1299 },
                    { id: 'rv2', title: 'Quantum Scan Pro', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80', price: 849 },
                    { id: 'rv3', title: 'Core Tablet Gen 3', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=200&q=80', price: 1199 },
                  ].map((rv) => (
                    <div
                      key={rv.id}
                      onClick={() => navigate(`/products/${rv.id}`)}
                      className="shrink-0 w-24 cursor-pointer group"
                    >
                      <img src={rv.image} alt="" className="w-full h-16 object-cover rounded-lg mb-1" />
                      <p className="text-[10px] font-medium text-[var(--color-on-surface)] truncate group-hover:text-[var(--color-primary)]">{rv.title}</p>
                      <p className="text-[10px] text-[var(--color-primary)]">${rv.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

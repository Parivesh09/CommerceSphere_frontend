import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { clearCart } from '../../../store/slices/cartSlice';
import { useCreateOrderMutation } from '../../../services/api/orderApi';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface ShippingForm {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

const deliveryMethods: DeliveryMethod[] = [
  { id: 'standard', name: 'Standard Ground', description: '4-7 business days via global logistics', price: 0, estimatedDays: '4-7' },
  { id: 'express', name: 'Express Saver', description: '2 business days with priority handling', price: 19.99, estimatedDays: '2' },
  { id: 'overnight', name: 'Priority Overnight', description: 'Next business day by 10:30 AM', price: 39.99, estimatedDays: '1' },
];

const StepCircle = ({ step, current, label }: { step: number; current: boolean; label: string }) => (
  <div className="relative z-10 flex flex-col items-center gap-2">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
        current
          ? 'bg-primary text-on-primary shadow-primary/30'
          : 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
      }`}
    >
      <span className="font-bold text-sm">{step}</span>
    </div>
    <span
      className={`text-xs font-semibold uppercase tracking-wider ${
        current ? 'text-primary' : 'text-on-surface-variant opacity-60'
      }`}
    >
      {label}
    </span>
  </div>
);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });
  const [selectedDelivery, setSelectedDelivery] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'corporate' | 'upi'>('card');

  const deliveryCost = deliveryMethods.find((d) => d.id === selectedDelivery)?.price || 0;
  const estimatedTax = total * 0.08;
  const orderTotal = total + estimatedTax + deliveryCost;

  const stepLabels = ['Shipping', 'Payment', 'Review'];
  const stepIndex = stepLabels.findIndex((_, i) => {
    const steps: CheckoutStep[] = ['shipping', 'payment', 'review'];
    return steps[i] === currentStep;
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId,
          unitPrice: item.unitPrice,
        })),
        shippingAddress: {
          street: shipping.street,
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
      };
      const result = await createOrder(orderData).unwrap();
      const orderId = result?.data?.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`${ROUTES.CHECKOUT}/confirmation`, {
        state: { orderId, total: orderTotal, address: shipping },
      });
    } catch {
      toast.error('Unable to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 text-center px-4">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_cart</span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">No items in cart for checkout</h2>
        <p className="text-on-surface-variant mb-6">Add some products before proceeding to checkout.</p>
        <button onClick={() => navigate(ROUTES.PRODUCTS)} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-medium hover:shadow-lg active:scale-95 transition-all">
          Return to Catalog
        </button>
      </div>
    );
  }

  const renderShippingStep = () => (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
          <h2 className="text-xl font-bold text-on-surface">Shipping Address</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant px-1">First Name</label>
              <input
                type="text"
                placeholder="Jane"
                value={shipping.firstName}
                onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant px-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={shipping.lastName}
                onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant px-1">Street Address</label>
            <input
              type="text"
              placeholder="123 Enterprise Way"
              value={shipping.street}
              onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant px-1">City</label>
              <input
                type="text"
                placeholder="New York"
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant px-1">State / Province</label>
              <select
                value={shipping.state}
                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
              >
                <option value="">Select</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="IL">Illinois</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant px-1">ZIP / Postal Code</label>
              <input
                type="text"
                placeholder="10001"
                value={shipping.postalCode}
                onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant px-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={shipping.phone}
              onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>
      </section>

      <section className="glass-card p-6 md:p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-2xl">speed</span>
          <h2 className="text-xl font-bold text-on-surface">Delivery Method</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {deliveryMethods.map((method) => (
            <label
              key={method.id}
              className={`relative flex p-4 rounded-xl cursor-pointer transition-all ${
                selectedDelivery === method.id
                  ? 'border-2 border-primary bg-primary/5 shadow-sm'
                  : 'border border-outline-variant hover:border-primary/50 bg-surface-container-low/30'
              }`}
            >
              <input
                type="radio"
                name="delivery"
                checked={selectedDelivery === method.id}
                onChange={() => setSelectedDelivery(method.id)}
                className="hidden"
              />
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-semibold text-sm ${selectedDelivery === method.id ? 'text-on-surface' : 'text-on-surface'}`}>
                    {method.name}
                  </span>
                  <span className={`text-sm font-bold ${method.price === 0 ? 'text-tertiary' : 'text-on-surface'}`}>
                    {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{method.description}</p>
              </div>
              <div className="ml-3 mt-0.5">
                {selectedDelivery === method.id ? (
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-outline">circle</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => setCurrentStep('payment')}
          className="bg-primary text-on-primary px-10 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          Continue to Payment
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-2xl">payment</span>
          <h2 className="text-xl font-bold text-on-surface">Payment Method</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'card' as const, icon: 'credit_card', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex' },
            { id: 'corporate' as const, icon: 'corporate_fare', title: 'Corporate Account', desc: 'Invoice Net 30/60' },
            { id: 'upi' as const, icon: 'account_balance_wallet', title: 'Instant Transfer', desc: 'UPI / Wire Transfer' },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`p-5 rounded-xl border text-left transition-all ${
                paymentMethod === method.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                  : 'border-outline-variant hover:border-outline bg-surface-container-low/30'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-primary">{method.icon}</span>
              <div className="mt-3">
                <p className="font-bold text-sm text-on-surface">{method.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{method.desc}</p>
              </div>
            </button>
          ))}
        </div>
        {paymentMethod === 'card' && (
          <div className="mt-6 space-y-4 pt-6 border-t border-outline-variant/30">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant px-1">Card Number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant px-1">Expiry Date</label>
                <input type="text" placeholder="MM/YY" className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant px-1">CVC</label>
                <input type="text" placeholder="123" className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface" />
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep('shipping')}
          className="px-6 py-3.5 rounded-xl font-semibold border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Shipping
          </span>
        </button>
        <button
          onClick={() => setCurrentStep('review')}
          className="bg-primary text-on-primary px-10 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          Review Order
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <section className="glass-card p-6 md:p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-2xl">checklist</span>
          <h2 className="text-xl font-bold text-on-surface">Review Your Order</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-surface-container-low rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-on-surface">Shipping Address</h3>
              <button onClick={() => setCurrentStep('shipping')} className="text-xs text-primary font-semibold hover:underline">Edit</button>
            </div>
            <p className="text-sm text-on-surface-variant">
              {shipping.firstName} {shipping.lastName}<br />
              {shipping.street}<br />
              {shipping.city}, {shipping.state} {shipping.postalCode}<br />
              {shipping.phone}
            </p>
          </div>
          <div className="p-4 bg-surface-container-low rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-on-surface">Delivery Method</h3>
              <button onClick={() => setCurrentStep('shipping')} className="text-xs text-primary font-semibold hover:underline">Edit</button>
            </div>
            <p className="text-sm text-on-surface-variant">
              {deliveryMethods.find((d) => d.id === selectedDelivery)?.name} — {deliveryCost === 0 ? 'FREE' : `$${deliveryCost.toFixed(2)}`}
            </p>
          </div>
          <div className="p-4 bg-surface-container-low rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-on-surface">Payment Method</h3>
              <button onClick={() => setCurrentStep('payment')} className="text-xs text-primary font-semibold hover:underline">Edit</button>
            </div>
            <p className="text-sm text-on-surface-variant capitalize">{paymentMethod.replace('_', ' ')}</p>
          </div>
        </div>
      </section>

      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep('payment')}
          className="px-6 py-3.5 rounded-xl font-semibold border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Payment
          </span>
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={isLoading}
          className="bg-primary text-on-primary px-10 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">lock</span>
              Confirm & Complete Purchase
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20">
        <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto h-full">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tighter text-on-surface">CommerceSphere</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-10 w-full">
        {/* Checkout Stepper */}
        <nav className="mb-8 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-outline-variant z-0"></div>
            {stepLabels.map((label, i) => (
              <StepCircle
                key={label}
                step={i + 1}
                current={stepIndex >= i}
                label={label}
              />
            ))}
          </div>
        </nav>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            {currentStep === 'shipping' && renderShippingStep()}
            {currentStep === 'payment' && renderPaymentStep()}
            {currentStep === 'review' && renderReviewStep()}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-card p-6 rounded-xl shadow-md border-t-4 border-primary space-y-5">
              <h3 className="text-lg font-bold text-on-surface">Order Summary</h3>

              {/* Item List */}
              <div className="space-y-3 pb-4 border-b border-outline-variant/30 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden border border-outline-variant/20">
                      <img
                        src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between gap-2">
                        <span className="text-sm font-semibold text-on-surface truncate">{item.product?.title || 'Product'}</span>
                        <span className="text-sm font-semibold text-on-surface shrink-0">${(item.unitPrice * item.quantity).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pb-4 border-b border-outline-variant/30 text-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-medium">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={deliveryCost === 0 ? 'text-tertiary font-bold' : 'text-on-surface'}>
                    {deliveryCost === 0 ? 'FREE' : `$${deliveryCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-on-surface font-medium">${estimatedTax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-on-surface">Total</span>
                <span className="text-2xl font-extrabold text-primary">${orderTotal.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface placeholder:text-on-surface-variant/50"
                />
                <button type="button" className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-lg text-xs font-semibold border border-outline-variant hover:bg-surface-variant transition-all">
                  Apply
                </button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-on-surface-variant pt-2">
                <span className="material-symbols-outlined text-base">verified_user</span>
                <span className="text-xs font-semibold">Secure SSL Encryption Active</span>
              </div>
            </div>
          </aside>
        </form>
      </main>

      {/* Footer */}
      <footer className="w-full mt-12 bg-surface-container-lowest border-t border-outline-variant py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-lg font-bold text-on-surface">CommerceSphere</p>
              <p className="text-xs text-on-surface-variant mt-1">&copy; 2024 CommerceSphere Enterprise. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">shield</span> PCI Compliant
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">lock</span> SSL Secure
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">payment</span> Visa / MC / Amex
              </div>
            </div>
            <div className="flex gap-4 text-xs text-on-surface-variant">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

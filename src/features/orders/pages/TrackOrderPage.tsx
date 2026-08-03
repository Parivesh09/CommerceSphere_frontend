import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = trackingId.trim();
    if (!value) {
      setError('Please enter an order or tracking ID.');
      return;
    }
    if (!/^[A-Za-z0-9-]+$/.test(value)) {
      setError('Order IDs can only contain letters, numbers, and dashes.');
      return;
    }
    setError('');
    navigate(`/orders/${value}`);
  };

  return (
    <div className="page-bg min-h-screen text-on-surface pt-32 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="glass-card rounded-2xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">local_shipping</span>
          </div>

          <h1 className="text-2xl font-bold text-on-surface">Track Your Order</h1>
          <p className="text-xs text-on-surface-variant">
            Enter your CommerceSphere Order ID or FedEx Tracking Number to view real-time location.
          </p>

          <form onSubmit={handleSearch} noValidate className="space-y-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="tracking-id" className="text-xs font-semibold text-on-surface-variant px-1">
                Order or Tracking ID
              </label>
              <input
                id="tracking-id"
                type="text"
                placeholder="e.g. ORD-892415 or FX-9012"
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                  if (error) setError('');
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'tracking-id-error' : undefined}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 text-on-surface placeholder:text-on-surface-variant/60"
              />
              {error && (
                <p id="tracking-id-error" role="alert" className="text-xs text-error px-1">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl shadow-glow hover:brightness-110 transition-all text-sm"
            >
              Track Package
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

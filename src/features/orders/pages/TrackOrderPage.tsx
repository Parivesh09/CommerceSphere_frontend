import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/orders/${trackingId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-32 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="glass-card rounded-3xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">local_shipping</span>
          </div>

          <h1 className="text-2xl font-bold text-[#0b1c30]">Track Your Order</h1>
          <p className="text-xs text-[#464555]">
            Enter your CommerceSphere Order ID or FedEx Tracking Number to view real-time location.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              placeholder="e.g. ORD-892415 or FX-9012"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#3525cd] text-white font-bold rounded-xl shadow-lg hover:bg-[#2c1eb3] transition-all text-sm"
            >
              Track Package
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

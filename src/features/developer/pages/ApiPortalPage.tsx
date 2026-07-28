import { useState } from 'react';
import toast from 'react-hot-toast';

export function ApiPortalPage() {
  const [apiKey] = useState('cs_live_9841290384109284091283');

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#0b1c30] text-white pt-28 pb-16">
      <main className="max-w-6xl mx-auto px-6 md:px-10 space-y-12">
        <div>
          <span className="text-xs font-mono text-[#67f4b7] uppercase tracking-widest">Developer Hub</span>
          <h1 className="text-3xl font-bold mt-1">CommerceSphere REST & Webhook API</h1>
          <p className="text-sm text-slate-300 mt-1">Build custom integrations using our RTK Query, REST Gateway, and Kafka Event Streams.</p>
        </div>

        {/* API Key Box */}
        <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-200">Production API Key</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="flex-grow px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-[#67f4b7]"
            />
            <button
              onClick={copyKey}
              className="px-4 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-xl hover:bg-[#2c1eb3]"
            >
              Copy Key
            </button>
          </div>
        </div>

        {/* Endpoints Documentation */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Core API Endpoints</h2>

          <div className="space-y-4">
            <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold rounded">GET</span>
                <code className="text-sm text-slate-200">/api/v1/products</code>
              </div>
              <p className="text-xs text-slate-400">Retrieve paginated product catalog list with filtering & sorting.</p>
            </div>

            <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 font-mono text-xs font-bold rounded">POST</span>
                <code className="text-sm text-slate-200">/api/v1/orders</code>
              </div>
              <p className="text-xs text-slate-400">Create an order and initiate the Kafka payment saga workflow.</p>
            </div>

            <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-xs font-bold rounded">GET</span>
                <code className="text-sm text-slate-200">/api/v1/orders/track/:id</code>
              </div>
              <p className="text-xs text-slate-400">Get real-time shipment status and tracking timeline events.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

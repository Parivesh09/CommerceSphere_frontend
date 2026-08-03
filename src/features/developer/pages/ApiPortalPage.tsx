import { useState } from 'react';
import toast from 'react-hot-toast';

export function ApiPortalPage() {
  const [apiKey] = useState('cs_live_9841290384109284091283');

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pt-28 pb-16">
      <main className="max-w-6xl mx-auto px-6 md:px-10 space-y-12">
        <div>
          <span className="text-xs font-mono text-success uppercase tracking-widest">Developer Hub</span>
          <h1 className="text-3xl font-bold mt-1">CommerceSphere REST & Webhook API</h1>
          <p className="text-sm text-on-surface-variant mt-1">Build custom integrations using our RTK Query, REST Gateway, and Kafka Event Streams.</p>
        </div>

        {/* API Key Box */}
        <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant space-y-3">
          <h3 className="text-sm font-bold text-on-surface">Demo API Key</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={apiKey}
              aria-label="Demo API key"
              className="flex-grow px-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-xs font-mono text-success"
            />
            <button
              onClick={copyKey}
              className="px-4 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary"
            >
              Copy Key
            </button>
          </div>
        </div>

        {/* Endpoints Documentation */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-on-surface">Core API Endpoints</h2>

          <div className="space-y-4">
            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-success/20 text-success font-mono text-xs font-bold rounded">GET</span>
                <code className="text-sm text-on-surface">/api/v1/products</code>
              </div>
              <p className="text-xs text-on-surface-variant">Retrieve paginated product catalog list with filtering & sorting.</p>
            </div>

            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-info/20 text-info font-mono text-xs font-bold rounded">POST</span>
                <code className="text-sm text-on-surface">/api/v1/orders</code>
              </div>
              <p className="text-xs text-on-surface-variant">Create an order and initiate the Kafka payment saga workflow.</p>
            </div>

            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-warning/20 text-warning font-mono text-xs font-bold rounded">GET</span>
                <code className="text-sm text-on-surface">/api/v1/orders/track/:id</code>
              </div>
              <p className="text-xs text-on-surface-variant">Get real-time shipment status and tracking timeline events.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

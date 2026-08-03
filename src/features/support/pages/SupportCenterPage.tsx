import { useState } from 'react';
import toast from 'react-hot-toast';

export function SupportCenterPage() {
  const [ticket, setTicket] = useState({ subject: '', category: 'technical', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support ticket created! A technician will respond within 15 minutes.');
    setTicket({ subject: '', category: 'technical', message: '' });
  };

  return (
    <div className="page-bg pt-28 pb-16">
      <main className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Enterprise Support Center</h1>
          <p className="text-sm text-muted">24/7 dedicated support for hardware, logistics, and API integrations.</p>
        </div>

        {/* Support Ticket Form */}
        <div className="surface-card rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] pb-3 border-b border-[var(--color-outline-variant)]">Submit Priority Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of issue..."
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Category</label>
              <select
                value={ticket.category}
                onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                className="input-field"
              >
                <option value="technical">Hardware & IoT Technical Support</option>
                <option value="billing">Enterprise Invoicing & Billing</option>
                <option value="api">Developer API & Webhooks</option>
                <option value="shipping">Logistics & Shipment Tracking</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Details & Log Snippets</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your request..."
                value={ticket.message}
                onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="button-primary text-xs"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

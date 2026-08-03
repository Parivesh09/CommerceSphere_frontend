import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export function EnterpriseLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)] pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
        {/* Enterprise Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wider">
            High Velocity Retail Engine
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight">
            Built for Billions in Annual Commerce GMV
          </h1>
          <p className="text-lg text-[var(--color-on-surface-variant)]">
            CommerceSphere provides the enterprise hardware, distributed microservices, and Kafka saga orchestration powering high-volume global retailers.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => toast.success('Enterprise Sales Request Submitted!')}
              className="px-8 py-3.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-bold shadow-lg shadow-[var(--color-primary)]/25 hover:bg-[var(--color-primary-container)] transition-all text-sm"
            >
              Contact Enterprise Sales
            </button>
            <button
              onClick={() => navigate(ROUTES.DEVELOPER)}
              className="px-6 py-3.5 glass-card rounded-xl font-bold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-lowest)] transition-all text-sm"
            >
              Explore API Docs
            </button>
          </div>
        </section>

        {/* Enterprise Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold">
              99.99%
            </div>
            <h3 className="text-xl font-bold text-[var(--color-on-surface)]">Guaranteed SLA</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Redundant Kubernetes clusters with automatic failover, global CDN edge caching, and zero-downtime deployments.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center font-bold">
              PCI-DSS
            </div>
            <h3 className="text-xl font-bold text-[var(--color-on-surface)]">Level 1 Security</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              SOC 2 Type II certified infrastructure with hardware security modules (HSM) and end-to-end tokenization.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] flex items-center justify-center font-bold">
              Kafka
            </div>
            <h3 className="text-xl font-bold text-[var(--color-on-surface)]">Event Streaming</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Apache Kafka saga orchestration for multi-region inventory synchronization and instant payment settling.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

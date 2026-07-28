import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export function EnterpriseLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
        {/* Enterprise Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#3525cd]/10 border border-[#3525cd]/20 text-[#3525cd] text-xs font-semibold uppercase tracking-wider">
            High Velocity Retail Engine
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0b1c30] tracking-tight leading-tight">
            Built for Billions in Annual Commerce GMV
          </h1>
          <p className="text-lg text-[#464555]">
            CommerceSphere provides the enterprise hardware, distributed microservices, and Kafka saga orchestration powering high-volume global retailers.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => toast.success('Enterprise Sales Request Submitted!')}
              className="px-8 py-3.5 bg-[#3525cd] text-white rounded-xl font-bold shadow-lg shadow-[#3525cd]/25 hover:bg-[#2c1eb3] transition-all text-sm"
            >
              Contact Enterprise Sales
            </button>
            <button
              onClick={() => navigate(ROUTES.DEVELOPER)}
              className="px-6 py-3.5 glass-card rounded-xl font-bold text-[#0b1c30] hover:bg-white transition-all text-sm"
            >
              Explore API Docs
            </button>
          </div>
        </section>

        {/* Enterprise Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center font-bold">
              99.99%
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30]">Guaranteed SLA</h3>
            <p className="text-xs text-[#464555]">
              Redundant Kubernetes clusters with automatic failover, global CDN edge caching, and zero-downtime deployments.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#831ada]/10 text-[#831ada] flex items-center justify-center font-bold">
              PCI-DSS
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30]">Level 1 Security</h3>
            <p className="text-xs text-[#464555]">
              SOC 2 Type II certified infrastructure with hardware security modules (HSM) and end-to-end tokenization.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              Kafka
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30]">Event Streaming</h3>
            <p className="text-xs text-[#464555]">
              Apache Kafka saga orchestration for multi-region inventory synchronization and instant payment settling.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

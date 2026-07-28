import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../constants';

const categories = [
  {
    id: 'terminals',
    title: 'Terminals & POS',
    description: 'Modern checkout devices built for retail speed and reliability.',
    image:
      'https://images.unsplash.com/photo-1517445312888-75f43f8e1e44?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'logistics',
    title: 'Logistics & RFID',
    description: 'Track inventory with precision using RFID scanners and readers.',
    image:
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'management',
    title: 'Smart Devices',
    description: 'Connected management tools for staff, inventory, and operations.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'audio',
    title: 'Peripherals',
    description: 'Premium accessories for immersive retail and customer experience.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'bundles',
    title: 'Starter Kits',
    description: 'All-in-one bundles to launch new stores faster and smarter.',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <div className="page-bg pt-24 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-10">
        <section className="mb-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3525cd]/90">Browse categories</p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">Find the right CommerceSphere solution</h1>
            <p className="mt-4 text-base text-muted leading-7">
              Explore enterprise categories optimized for retail, logistics, and customer experience.
              Filter by capability and discover products designed for modern commerce ecosystems.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => navigate(`${ROUTES.PRODUCTS}?category=${encodeURIComponent(category.id)}`)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="group text-left rounded-[2rem] overflow-hidden border border-slate-200 surface-card shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              aria-label={`Explore ${category.title}`}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b1c30]">
                    {category.title}
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-6">
                <h2 className="text-xl font-semibold text-[#0b1c30]">{category.title}</h2>
                <p className="text-sm text-[#52525b] leading-6">{category.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3525cd]">
                  <span>Shop category</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </motion.button>
          ))}
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] bg-[#3525cd] p-10 text-white shadow-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">CommerceSphere Insights</span>
            <h2 className="mt-4 text-3xl font-bold">Build a connected commerce ecosystem</h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Our category-driven product catalog helps enterprise teams move from pilot to production quickly with preconfigured hardware and deep analytics.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Inventory</p>
                <p className="mt-3 text-base font-semibold">Real-time tracking across stores, warehouses, and routes.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Checkout</p>
                <p className="mt-3 text-base font-semibold">Secure payments with built-in fraud controls and tokenization.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] surface-card p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Trending category picks</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-[#f1f5ff] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3525cd]">Terminal suites</p>
                <p className="mt-2 text-sm text-[#52525b]">High-performance checkout hardware for omni-channel operations.</p>
              </div>
              <div className="rounded-3xl bg-[#f8fafc] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3525cd]">RFID devices</p>
                <p className="mt-2 text-sm text-[#52525b]">Hands-free scanning for warehouse and store automation.</p>
              </div>
              <div className="rounded-3xl bg-[#f1f5ff] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3525cd]">Device bundles</p>
                <p className="mt-2 text-sm text-[#52525b]">Complete kits with software, hardware, and deployment services.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

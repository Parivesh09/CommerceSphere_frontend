import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import { useGetProductsQuery } from '../../../services/api/productApi';
import { useCart } from '../../cart/hooks';
import toast from 'react-hot-toast';
import { ProductCard } from '../components';

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: productsData, isLoading } = useGetProductsQuery({ pageSize: 4 });

  const sampleProducts = [
    { id: 'prod-1', title: 'Matrix Point 2.0 Terminal', category: 'Terminals', price: 1299.00, description: 'Enterprise transactions with instant settlement.', image: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-2', title: 'Quantum Scan Pro', category: 'Logistics', price: 849.00, description: 'Sub-millisecond inventory scanning and optical tag tracking.', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-3', title: 'CommerceSphere Founder Kit', category: 'Bundles', price: 4500.00, description: 'Complete retail foundation package with hardware and IoT hubs.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-4', title: 'Core Tablet Gen 3', category: 'Management', price: 1199.00, description: 'Mobile management with ultra-thin bezel and biometric security.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80' },
  ];

  const productsList = (productsData?.data && productsData.data.length > 0)
    ? productsData.data.slice(0, 4).map((p) => ({
        id: p.id, title: p.title, category: 'Hardware', price: p.price,
        description: p.description,
        image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      }))
    : sampleProducts;

  const handleAddToCart = (product: typeof sampleProducts[0]) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
    });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Aurora backdrop */}
        <div className="absolute inset-0">
          <div className="aurora-orb w-[42rem] h-[42rem] -top-40 -right-24 bg-[var(--color-primary)] opacity-40" />
          <div className="aurora-orb w-[36rem] h-[36rem] -bottom-48 -left-24 bg-[var(--color-secondary)] opacity-30" />
          <div className="aurora-orb w-[30rem] h-[30rem] top-1/3 left-1/2 -translate-x-1/2 bg-[var(--color-tertiary)] opacity-20" />
          <div className="absolute inset-0 hero-grid" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-10 w-full py-24">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-(--color-primary) text-xs font-semibold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-glow" />
              Enterprise Collection 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-(--color-on-surface)">
              New Season.
              <br />
              <span className="gradient-text">Redefined Utility.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed">
              Experience the next generation of commerce. Built for performance, designed for the world's most demanding retail ecosystems.
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate(ROUTES.PRODUCTS)}
                className="px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-semibold text-base shadow-glow hover:brightness-110 transition-all active:scale-[0.97]"
              >
                Shop Collection
              </button>
              <button
                onClick={() => navigate(ROUTES.ENTERPRISE)}
                className="px-8 py-4 rounded-xl font-semibold text-base border border-[var(--color-outline-variant)] text-(--color-on-surface) hover:bg-[var(--color-surface-container-low)] hover:border-[var(--color-primary)]/50 transition-all active:scale-[0.97] flex items-center gap-2"
              >
                View Lookbook
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-(--color-on-surface)">Curated Categories</h2>
            <p className="text-base text-on-surface-variant mt-2">Precision engineered for every enterprise need.</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="text-(--color-primary) font-semibold text-sm flex items-center gap-1 hover:underline underline-offset-4 shrink-0"
          >
            Browse All <span className="material-symbols-outlined text-lg">open_in_new</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[500px]">
          <div className="md:col-span-8 relative rounded-2xl overflow-hidden group cursor-pointer border border-[var(--color-outline-variant)]/50">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-0 p-8 md:p-10 w-full" onClick={() => navigate(ROUTES.PRODUCTS)}>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Smart Infrastructure</h3>
              <p className="text-white/70 text-base mt-2">Connected systems for the modern warehouse.</p>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer border border-[var(--color-outline-variant)]/50">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-6" onClick={() => navigate(ROUTES.PRODUCTS)}>
                <h3 className="text-xl font-bold text-white">Audio and Peripherals</h3>
              </div>
            </div>
            <div className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer border border-[var(--color-outline-variant)]/50">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-6" onClick={() => navigate(ROUTES.PRODUCTS)}>
                <h3 className="text-xl font-bold text-white">Store Experience</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-20 bg-surface-container-low/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-(--color-on-surface)">Trending Now</h2>
            <div className="h-1 w-20 bg-linear-to-r from-(--color-primary) to-secondary mx-auto mt-4 rounded-full" />
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsList.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: 'speed', title: 'Fast delivery', desc: 'Global logistics infrastructure ensuring 24-hour fulfillment to major enterprise hubs worldwide.' },
            { icon: 'support_agent', title: '24/7 Support', desc: 'Dedicated success managers available around the clock to ensure your operations never stop.' },
            { icon: 'eco', title: 'Sustainable', desc: 'Carbon-neutral manufacturing and fully biodegradable enterprise-grade packaging as standard.' },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-start gap-4 glass-card rounded-2xl p-8">
              <div className="p-4 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl text-white shadow-glow">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-(--color-on-surface)">{feature.title}</h3>
              <p className="text-base text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]" />
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="aurora-orb w-96 h-96 -top-20 -left-20 bg-white" />
          <div className="aurora-orb w-96 h-96 -bottom-20 -right-20 bg-black/40" />
        </div>
        <div className="max-w-3xl mx-auto px-4 md:px-10 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-sm">Join the Inner Circle</h2>
          <p className="text-lg text-white/85 mt-4 mb-8">
            Be the first to access exclusive enterprise releases and global market insights.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              className="flex-1 px-6 py-4 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm transition-all text-base"
              placeholder="Enterprise Email"
              type="email"
            />
            <button className="px-10 py-4 bg-white text-(--color-primary) font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-xl text-base" type="submit">
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-white/60">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </section>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import { useGetProductsQuery } from '../../../services/api/productApi';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { addToCart } from '../../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: productsData, isLoading } = useGetProductsQuery({ pageSize: 4 });

  const sampleProducts = [
    { id: 'prod-1', title: 'Matrix Point 2.0 Terminal', category: 'Terminals', price: 1299.00, description: 'The benchmark for enterprise transactions with instant settlement.', image: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-2', title: 'Quantum Scan Pro', category: 'Logistics', price: 849.00, description: 'Sub-millisecond inventory scanning and optical tag tracking.', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-3', title: 'CommerceSphere Founder Kit', category: 'Bundles', price: 4500.00, description: 'Complete retail foundation package with hardware & IoT hubs.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-4', title: 'Core Tablet Gen 3', category: 'Management', price: 1199.00, description: 'Mobile management device with ultra-thin bezel & biometric security.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80' },
  ];

  const productsList = (productsData?.data && productsData.data.length > 0)
    ? productsData.data.slice(0, 4).map((p) => ({
        id: p.id, title: p.title, category: 'Hardware', price: p.price,
        description: p.description,
        image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      }))
    : sampleProducts;

  const handleAddToCart = (product: typeof sampleProducts[0]) => {
    dispatch(addToCart({
      id: product.id, productId: product.id, quantity: 1, unitPrice: product.price,
      product: {
        id: product.id, title: product.title, description: product.description,
        price: product.price, categoryId: 'cat-1', inventoryQuantity: 50,
        status: 'active' as const,
        images: [{ id: 'img-1', productId: product.id, url: product.image, displayOrder: 0, createdAt: '' }],
        createdAt: '', updatedAt: '',
      },
    }));
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <>
      <section className="relative pt-20 overflow-hidden min-h-[921px] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10"></div>
          <div
            className="bg-cover bg-center w-full h-full transform scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=1920&q=80')` }}
          ></div>
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-margin-desktop w-full">
          <div className="max-w-2xl space-y-md">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-container/10 border border-primary/20 text-primary-container font-label-md uppercase tracking-widest">
              Enterprise Collection 2026
            </div>
            <h1 className="font-display-lg text-display-lg md:text-[64px] leading-none text-on-surface">
              New Season.<br />
              <span className="text-primary">Redefined Utility.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Experience the next generation of commerce. Built for performance, designed for the world's most demanding retail ecosystems.
            </p>
            <div className="flex gap-sm pt-4">
              <button
                onClick={() => navigate(ROUTES.PRODUCTS)}
                className="px-xl py-4 bg-primary text-on-primary rounded-xl font-body-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                Shop Collection
              </button>
              <button
                onClick={() => navigate(ROUTES.ENTERPRISE)}
                className="px-md py-4 glass-card rounded-xl font-body-md text-on-surface hover:bg-white transition-all active:scale-95 flex items-center gap-2"
              >
                View Lookbook <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xl max-w-7xl mx-auto px-margin-desktop">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Curated Categories</h2>
            <p className="font-body-md text-on-surface-variant">Precision engineered for every enterprise need.</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="text-primary font-body-md flex items-center gap-1 hover:underline underline-offset-4"
          >
            Browse All <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-[600px]">
          <div className="md:col-span-8 relative rounded-2xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
            <div
              className="absolute bottom-0 p-lg w-full cursor-pointer"
              onClick={() => navigate(ROUTES.PRODUCTS)}
            >
              <h3 className="font-headline-md text-headline-md text-white">Smart Infrastructure</h3>
              <p className="text-white/80 font-body-sm mt-2">Connected systems for the modern warehouse.</p>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-gutter">
            <div className="h-1/2 relative rounded-2xl overflow-hidden group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
              <div
                className="absolute bottom-0 p-md cursor-pointer"
                onClick={() => navigate(ROUTES.PRODUCTS)}
              >
                <h3 className="font-body-lg font-bold text-white">Audio & Peripherals</h3>
              </div>
            </div>
            <div className="h-1/2 relative rounded-2xl overflow-hidden group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
              <div
                className="absolute bottom-0 p-md cursor-pointer"
                onClick={() => navigate(ROUTES.PRODUCTS)}
              >
                <h3 className="font-body-lg font-bold text-white">Store Experience</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xl bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Trending Now</h2>
            <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 glass-card rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {productsList.map((product) => (
                <div key={product.id} className="glass-card rounded-2xl overflow-hidden flex flex-col p-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <div
                      className="bg-cover bg-center w-full h-full transition-transform duration-500 hover:scale-105 cursor-pointer"
                      style={{ backgroundImage: `url('${product.image}')` }}
                      onClick={() => navigate(`/products/${product.id}`)}
                    ></div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <span className="font-label-md text-primary uppercase">{product.category}</span>
                    <h3
                      className="font-body-md font-bold text-on-surface mt-1 cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.title}
                    </h3>
                    <p className="font-body-sm text-on-surface-variant mt-1 line-clamp-1">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/30">
                    <span className="font-headline-md text-headline-md text-on-surface">${product.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-on-surface text-surface px-4 py-2 rounded-lg font-body-sm hover:bg-primary transition-colors active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-xl max-w-7xl mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <div className="flex flex-col items-start gap-4">
            <div className="p-4 bg-primary-container/10 rounded-2xl text-primary">
              <span className="material-symbols-outlined text-[32px]">speed</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Fast delivery</h3>
            <p className="font-body-md text-on-surface-variant">Global logistics infrastructure ensuring 24-hour fulfillment to major enterprise hubs worldwide.</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="p-4 bg-primary-container/10 rounded-2xl text-primary">
              <span className="material-symbols-outlined text-[32px]">support_agent</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">24/7 Support</h3>
            <p className="font-body-md text-on-surface-variant">Dedicated success managers available around the clock to ensure your operations never stop.</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="p-4 bg-primary-container/10 rounded-2xl text-primary">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Sustainable</h3>
            <p className="font-body-md text-on-surface-variant">Carbon-neutral manufacturing and fully biodegradable enterprise-grade packaging as standard.</p>
          </div>
        </div>
      </section>

      <section className="py-xl bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary-container rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-3xl mx-auto px-margin-desktop text-center relative z-10">
          <h2 className="font-display-lg text-display-lg text-on-primary">Join the Inner Circle</h2>
          <p className="font-body-lg text-on-primary-container mt-4 mb-lg opacity-80">Be the first to access exclusive enterprise releases and global market insights.</p>
          <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm transition-all"
              placeholder="Enterprise Email"
              type="email"
            />
            <button className="px-xl py-4 bg-white text-primary font-bold rounded-xl hover:bg-surface-bright transition-all active:scale-95 shadow-xl" type="submit">
              Subscribe
            </button>
          </form>
          <p className="mt-4 font-label-md text-on-primary-container/60">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
        </div>
      </section>
    </>
  );
}
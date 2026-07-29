import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export default function SellerProductsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">My Products</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage your product listings</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.SELLER_PRODUCT_NEW)}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add Product
        </button>
      </div>

      <div className="glass-card rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-outline-variant block mb-4">inventory_2</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">No Products Yet</h2>
        <p className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
          Start listing your products on CommerceSphere to reach millions of customers.
        </p>
        <button
          onClick={() => navigate(ROUTES.SELLER_PRODUCT_NEW)}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:scale-95 transition-all"
        >
          List Your First Product
        </button>
      </div>
    </div>
  );
}

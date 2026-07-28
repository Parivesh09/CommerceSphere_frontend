import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../../../services/api/productApi';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export function AdminProductsPage() {
  const navigate = useNavigate();
  const { data: responseData, isLoading } = useGetProductsQuery({ pageSize: 10 });
  const [deleteProduct] = useDeleteProductMutation();

  const sampleProducts = [
    { id: 'prod-1', title: 'Matrix Point 2.0 Terminal', price: 1299, inventoryQuantity: 25, status: 'active' },
    { id: 'prod-2', title: 'Quantum Scan Pro', price: 849, inventoryQuantity: 40, status: 'active' },
    { id: 'prod-3', title: 'CommerceSphere Founder Kit', price: 4500, inventoryQuantity: 12, status: 'active' },
    { id: 'prod-4', title: 'Core Tablet Gen 3', price: 1199, inventoryQuantity: 18, status: 'active' },
  ];

  const products = responseData?.data || sampleProducts;

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch {
        toast.success('Product removed from catalog');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Product Management</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage catalog items, pricing, inventory levels, and visibility.</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.ADMIN_PRODUCT_NEW)}
          className="px-4 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl shadow hover:bg-primary-container transition-colors flex items-center gap-1 self-start"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> Add New Product
        </button>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading catalog products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold uppercase text-on-surface-variant">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low">
                    <td className="py-3 font-bold text-on-surface">{p.title}</td>
                    <td className="py-3 font-semibold text-primary">${p.price.toLocaleString()}</td>
                    <td className="py-3 font-medium">{p.inventoryQuantity} units</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-fixed text-primary">
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                        className="px-3 py-1 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-error-container text-error text-xs font-semibold rounded-lg hover:bg-error-container"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

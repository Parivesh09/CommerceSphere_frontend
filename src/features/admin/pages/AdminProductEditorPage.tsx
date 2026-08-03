import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProductMutation, useGetProductQuery, useUpdateProductMutation } from '../../../services/api/productApi';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export function AdminProductEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id && id !== 'new');

  const { data: existingProduct } = useGetProductQuery(id || '', { skip: !isEditing });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 999,
    categoryId: 'terminals',
    inventoryQuantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=600&q=80',
  });
  const [loadedProductId, setLoadedProductId] = useState<string | null>(null);

  if (isEditing && existingProduct && loadedProductId !== existingProduct.id) {
    setLoadedProductId(existingProduct.id);
    setFormData({
      title: existingProduct.title,
      description: existingProduct.description,
      price: existingProduct.price,
      categoryId: existingProduct.categoryId,
      inventoryQuantity: existingProduct.inventoryQuantity,
      imageUrl: existingProduct.images?.[0]?.url || '',
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      categoryId: formData.categoryId,
      inventoryQuantity: Number(formData.inventoryQuantity),
      images: [{ id: 'img-1', productId: 'temp', url: formData.imageUrl, displayOrder: 0, createdAt: '' }],
      status: 'active' as const,
    };
    try {
      if (isEditing && id) {
        await updateProduct({ id, data: payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      toast.success(isEditing ? 'Product updated successfully' : 'New product created in catalog');
      navigate(ROUTES.ADMIN_PRODUCTS);
    } catch {
      toast.error(isEditing ? 'Failed to update product. Please try again.' : 'Failed to create product. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">
            {isEditing ? 'Edit Enterprise Product' : 'Create New Product'}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Configure title, pricing specs, categories, and inventory allocation.</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
          className="px-4 py-2 glass-card text-[var(--color-on-surface)] text-xs font-bold rounded-xl"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Matrix Point 2.0 Terminal"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Product Description</label>
            <textarea
              rows={3}
              required
              placeholder="Enterprise specification description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Price ($ USD)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Initial Stock Allocation</label>
            <input
              type="number"
              required
              value={formData.inventoryQuantity}
              onChange={(e) => setFormData({ ...formData, inventoryQuantity: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="terminals">Terminals & POS</option>
              <option value="logistics">Logistics & RFID</option>
              <option value="bundles">Starter Kits</option>
              <option value="management">Smart Devices</option>
              <option value="audio">Peripherals</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Image URL</label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--color-outline-variant)] flex justify-end gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-primary text-on-primary text-sm font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all disabled:opacity-50"
          >
            {isLoading ? 'Saving Product...' : isEditing ? 'Save Product Changes' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

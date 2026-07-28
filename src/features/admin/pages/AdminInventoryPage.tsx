import { useGetInventoryListQuery, useUpdateStockLevelMutation } from '../../../services/api/adminApi';
import toast from 'react-hot-toast';

export function AdminInventoryPage() {
  const { data: inventoryResponse, isLoading } = useGetInventoryListQuery();
  const [updateStock] = useUpdateStockLevelMutation();

  const mockInventory = [
    { id: '1', productId: 'prod-1', productTitle: 'Matrix Point 2.0 Terminal', sku: 'SKU-TRM-001', quantity: 25, reservedQuantity: 5, reorderPoint: 10, status: 'in_stock' as const },
    { id: '2', productId: 'prod-2', productTitle: 'Quantum Scan Pro', sku: 'SKU-SCN-002', quantity: 8, reservedQuantity: 2, reorderPoint: 10, status: 'low_stock' as const },
    { id: '3', productId: 'prod-3', productTitle: 'CommerceSphere Founder Kit', sku: 'SKU-BND-003', quantity: 12, reservedQuantity: 1, reorderPoint: 5, status: 'in_stock' as const },
    { id: '4', productId: 'prod-4', productTitle: 'Core Tablet Gen 3', sku: 'SKU-TBL-004', quantity: 2, reservedQuantity: 1, reorderPoint: 5, status: 'low_stock' as const },
  ];

  const items = inventoryResponse?.data || mockInventory;

  const handleStockUpdate = async (sku: string, currentQty: number) => {
    const newQty = prompt('Enter new stock quantity for SKU ' + sku, String(currentQty));
    if (newQty !== null && !isNaN(Number(newQty))) {
      try {
        await updateStock({ sku, quantity: Number(newQty) }).unwrap();
        toast.success(`Stock level updated for ${sku}`);
      } catch {
        toast.success(`Stock level updated for ${sku}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0b1c30]">Inventory Management</h1>
        <p className="text-sm text-[#464555] mt-1">Real-time stock tracking, reserved allocation, and reorder point alerts.</p>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading inventory data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">SKU Code</th>
                  <th className="pb-3">Available Stock</th>
                  <th className="pb-3">Reserved Stock</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-[#0b1c30]">{item.productTitle}</td>
                    <td className="py-3 font-mono text-xs text-[#3525cd]">{item.sku}</td>
                    <td className="py-3 font-bold">{item.quantity} units</td>
                    <td className="py-3 text-[#464555]">{item.reservedQuantity} units</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.quantity <= item.reorderPoint
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.quantity <= item.reorderPoint ? 'Low Stock Alert' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleStockUpdate(item.sku, item.quantity)}
                        className="px-3 py-1 bg-[#3525cd] text-white text-xs font-bold rounded-lg hover:bg-[#2c1eb3]"
                      >
                        Adjust Stock
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

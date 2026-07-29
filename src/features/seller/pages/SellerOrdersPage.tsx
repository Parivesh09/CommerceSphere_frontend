export default function SellerOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Orders</h1>
        <p className="text-sm text-on-surface-variant mt-1">View and manage orders for your products</p>
      </div>

      <div className="glass-card rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-outline-variant block mb-4">receipt_long</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">No Orders Yet</h2>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
          When customers start ordering your products, you'll see them here.
        </p>
      </div>
    </div>
  );
}

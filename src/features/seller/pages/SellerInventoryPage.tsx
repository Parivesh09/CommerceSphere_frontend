export default function SellerInventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Inventory</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-3" />
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Manage stock levels for your products</p>
      </div>

      <div className="glass-card rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-[var(--color-outline-variant)] block mb-4">warehouse</span>
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">No Inventory Data</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm mx-auto">
          Add products and manage stock levels from here.
        </p>
      </div>
    </div>
  );
}

export default function SellerReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Product Reviews</h1>
        <p className="text-sm text-on-surface-variant mt-1">Monitor and respond to customer reviews</p>
      </div>

      <div className="glass-card rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-outline-variant block mb-4">rate_review</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">No Reviews Yet</h2>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
          Customer reviews for your products will appear here.
        </p>
      </div>
    </div>
  );
}

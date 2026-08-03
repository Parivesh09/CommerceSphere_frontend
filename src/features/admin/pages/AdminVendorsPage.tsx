import { useGetVendorsQuery, useUpdateVendorStatusMutation } from '../../../services/api/adminApi';
import type { Vendor } from '../../../services/api/adminApi';
import toast from 'react-hot-toast';

export function AdminVendorsPage() {
  const { data: vendorsResponse, isLoading } = useGetVendorsQuery();
  const [updateStatus] = useUpdateVendorStatusMutation();

  const mockVendors: Vendor[] = [
    { id: 'v-1', name: 'Cyberdyne Systems', email: 'supply@cyberdyne.io', companyName: 'Cyberdyne Global', status: 'active', rating: 4.9, productCount: 14, totalSales: 450000, createdAt: '' },
    { id: 'v-2', name: 'Stark Manufacturing', email: 'venders@stark.com', companyName: 'Stark Industries', status: 'active', rating: 4.8, productCount: 22, totalSales: 890000, createdAt: '' },
    { id: 'v-3', name: 'Wayne Logistics', email: 'partner@wayne.com', companyName: 'Wayne Enterprises', status: 'pending', rating: 4.5, productCount: 6, totalSales: 120000, createdAt: '' },
  ];

  const vendors = vendorsResponse?.data || mockVendors;

  const handleStatusChange = async (id: string, status: Vendor['status']) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Vendor status updated to ${status}`);
    } catch {
      toast.error(`Failed to update vendor status. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Vendor Management</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-3" />
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Manage 3rd party enterprise hardware suppliers, SLAs, and onboarding status.</p>
        </div>
        <button onClick={() => toast.success('Vendor onboarding request sent')} className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl shadow-glow hover:brightness-110">
          + Onboard New Vendor
        </button>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[var(--color-on-surface-variant)]">Loading vendors...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] text-xs font-bold uppercase text-[var(--color-on-surface-variant)]">
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Contact Email</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Total Sales</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-[var(--color-surface-container-low)]">
                    <td className="py-3 font-bold text-[var(--color-on-surface)]">{v.companyName}</td>
                    <td className="py-3 text-[var(--color-on-surface-variant)]">{v.email}</td>
                    <td className="py-3 text-[var(--color-secondary)] font-semibold">★ {v.rating}</td>
                    <td className="py-3 font-bold text-[var(--color-primary)]">${v.totalSales.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        v.status === 'active' ? 'bg-success/10 text-success' :
                        v.status === 'suspended' ? 'bg-error/10 text-error' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v.id, e.target.value as Vendor['status'])}
                        aria-label={`Update status for vendor ${v.companyName}`}
                        className="px-3 py-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg text-xs font-semibold text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="active">ACTIVE</option>
                        <option value="pending">PENDING</option>
                        <option value="suspended">SUSPENDED</option>
                      </select>
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

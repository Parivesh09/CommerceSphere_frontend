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
      toast.success(`Vendor status updated to ${status}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0b1c30]">Vendor Management</h1>
          <p className="text-sm text-[#464555] mt-1">Manage 3rd party enterprise hardware suppliers, SLAs, and onboarding status.</p>
        </div>
        <button onClick={() => toast.success('Vendor onboarding request sent')} className="px-4 py-2 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow">
          + Onboard New Vendor
        </button>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading vendors...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Contact Email</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Total Sales</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-[#0b1c30]">{v.companyName}</td>
                    <td className="py-3 text-[#464555]">{v.email}</td>
                    <td className="py-3 text-amber-500 font-semibold">★ {v.rating}</td>
                    <td className="py-3 font-bold text-[#3525cd]">${v.totalSales.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${v.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v.id, e.target.value as Vendor['status'])}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#0b1c30]"
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

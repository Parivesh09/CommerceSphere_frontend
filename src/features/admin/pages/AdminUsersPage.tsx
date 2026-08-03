import { useGetAdminUsersListQuery, useUpdateUserRoleMutation } from '../../../services/api/adminApi';
import type { User } from '../../../types';
import toast from 'react-hot-toast';

export function AdminUsersPage() {
  const { data: usersResponse, isLoading } = useGetAdminUsersListQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  const mockUsers: User[] = [
    { id: 'usr-101', name: 'John Doe', email: 'john@acme.com', role: 'customer', createdAt: '2026-01-15', updatedAt: '' },
    { id: 'usr-102', name: 'Sarah Jenkins', email: 'sarah@stark.com', role: 'admin', createdAt: '2026-02-10', updatedAt: '' },
    { id: 'usr-103', name: 'Marcus Vance', email: 'marcus@wayne.com', role: 'moderator', createdAt: '2026-03-05', updatedAt: '' },
  ];

  const users = usersResponse?.data || mockUsers;

  const handleRoleChange = async (userId: string, role: User['role']) => {
    try {
      await updateRole({ userId, role }).unwrap();
      toast.success(`User role updated to ${role}`);
    } catch {
      toast.error(`Failed to update role for ${userId}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Customer CRM & User Roles</h1>
        <p className="text-sm text-on-surface-variant mt-1">Manage enterprise customer accounts, access levels, and moderation roles.</p>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading user database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-xs font-bold uppercase text-on-surface-variant">
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-right">Access Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low">
                    <td className="py-3 font-bold text-on-surface">{u.name}</td>
                    <td className="py-3 text-on-surface-variant">{u.email}</td>
                    <td className="py-3 text-on-surface-variant">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-fixed text-primary">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as User['role'])}
                        aria-label={`Update access role for ${u.name}`}
                        className="px-3 py-1 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="customer">CUSTOMER</option>
                        <option value="moderator">MODERATOR</option>
                        <option value="admin">ADMIN</option>
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

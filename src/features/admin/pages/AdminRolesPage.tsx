import { useGetRolesListQuery } from '../../../services/api/adminApi';
import type { Role } from '../../../services/api/adminApi';
import toast from 'react-hot-toast';

export function AdminRolesPage() {
  const { data: rolesResponse, isLoading } = useGetRolesListQuery();

  const mockRoles: Role[] = [
    { id: 'r-1', name: 'Super Admin', description: 'Full system access including RBAC, Saga triggers, and billing.', permissions: ['all'], userCount: 3 },
    { id: 'r-2', name: 'Store Manager', description: 'Manage products, inventory, and order orchestration.', permissions: ['products:write', 'orders:read', 'inventory:write'], userCount: 12 },
    { id: 'r-3', name: 'Support Agent', description: 'View customer tickets, order statuses, and tracking info.', permissions: ['orders:read', 'customers:read'], userCount: 25 },
  ];

  const roles = rolesResponse?.data || mockRoles;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Roles & Permissions Matrix</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-3" />
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Configure role-based access control (RBAC) and fine-grained API scopes.</p>
        </div>
        <button onClick={() => toast.success('New role form open')} className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl shadow-glow hover:brightness-110">
          + Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 p-8 text-center text-sm text-[var(--color-on-surface-variant)]">Loading roles...</div>
        ) : (
          roles.map((role) => (
            <div key={role.id} className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-[var(--color-on-surface)]">{role.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-primary-container)] text-[var(--color-primary)]">
                    {role.userCount} users
                  </span>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">{role.description}</p>
                <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)] flex flex-wrap gap-1.5">
                  {role.permissions.map((perm, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-[10px] font-mono rounded-md">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => toast.success(`Editing ${role.name}`)} className="w-full py-2 bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-xs font-semibold rounded-xl hover:bg-[var(--color-surface-container)]">
                Configure Permissions
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

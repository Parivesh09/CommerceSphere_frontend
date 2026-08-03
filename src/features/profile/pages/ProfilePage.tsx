import { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setUser } from '../../../store/slices/authSlice';
import { useUpdateProfileMutation } from '../api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'addresses'>('profile');

  const [formData, setFormData] = useState({
    name: auth.user?.name || 'Parivesh Enterprise User',
    email: auth.user?.email || 'parivesh@commercesphere.io',
    company: 'Acme Enterprise Global',
    role: auth.user?.role || 'admin',
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) {
      toast.error('You must be signed in to update your profile.');
      return;
    }
    try {
      const updated = await updateProfile({ name: formData.name }).unwrap();
      dispatch(setUser({ ...auth.user, name: updated.name, email: updated.email }));
      toast.success('Profile settings saved successfully!');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] pt-28 pb-16">
      <main className="max-w-6xl mx-auto px-4 md:px-10">
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">Account Settings</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">Manage your enterprise profile, security credentials, and organization preferences.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <aside className="md:col-span-3">
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">person</span> Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                  activeTab === 'security'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">shield</span> Security & Auth
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface)]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">location_on</span> Shipping Addresses
              </button>
            </div>
          </aside>

          {/* Tab Contents */}
          <div className="md:col-span-9">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-8 gap-6 flex flex-col">
                <h2 className="text-xl font-bold text-[var(--color-on-surface)] pb-3 border-b border-[var(--color-outline-variant)]">Personal & Company Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Corporate Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Role</label>
                    <input
                      type="text"
                      disabled
                      value={formData.role.toUpperCase()}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] text-sm text-[var(--color-on-surface-variant)] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-outline-variant)] flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold rounded-xl shadow-lg hover:brightness-90 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="glass-card rounded-2xl p-8 gap-6 flex flex-col">
                <h2 className="text-xl font-bold text-[var(--color-on-surface)] pb-3 border-b border-[var(--color-outline-variant)]">Security Credentials</h2>
                <div className="gap-6 flex flex-col max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <button
                    onClick={() => toast.success('Password updated!')}
                    className="px-6 py-2.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold rounded-xl hover:brightness-90"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="glass-card rounded-2xl p-8 gap-6 flex flex-col">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-outline-variant)]">
                  <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Saved Corporate Addresses</h2>
                  <button onClick={() => toast.success('Address modal open')} className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-semibold rounded-xl">
                    + Add New Address
                  </button>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] gap-3 flex flex-col">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Primary Warehouse</span>
                  <p className="text-sm font-bold text-[var(--color-on-surface)]">100 Enterprise Way, Suite 400</p>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">San Francisco, CA 94105, United States</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

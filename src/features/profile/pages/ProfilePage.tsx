import { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setCredentials } from '../../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'addresses'>('profile');

  const [formData, setFormData] = useState({
    name: auth.user?.name || 'Parivesh Enterprise User',
    email: auth.user?.email || 'parivesh@commercesphere.io',
    company: 'Acme Enterprise Global',
    role: auth.user?.role || 'admin',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.user) {
      dispatch(
        setCredentials({
          user: { ...auth.user, name: formData.name, email: formData.email },
          accessToken: auth.accessToken || '',
          refreshToken: auth.refreshToken || '',
        })
      );
    }
    toast.success('Profile settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pt-28 pb-16">
      <main className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Account Settings</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-8">Manage your enterprise profile, security credentials, and organization preferences.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <aside className="md:col-span-3">
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl font-label-md text-label-md flex items-center gap-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">person</span> Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl font-label-md text-label-md flex items-center gap-sm transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">shield</span> Security & Auth
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-xl font-label-md text-label-md flex items-center gap-sm transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">location_on</span> Shipping Addresses
              </button>
            </div>
          </aside>

          {/* Tab Contents */}
          <div className="md:col-span-9">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-lg gap-gutter flex flex-col">
                <h2 className="font-headline-md text-headline-md text-on-surface pb-3 border-b border-outline-variant">Personal & Company Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Corporate Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Role</label>
                    <input
                      type="text"
                      disabled
                      value={formData.role.toUpperCase()}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-variant border border-outline-variant font-body-sm text-body-sm text-on-surface-variant cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-xl shadow-lg hover:brightness-90 transition-all"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="glass-card rounded-2xl p-lg gap-gutter flex flex-col">
                <h2 className="font-headline-md text-headline-md text-on-surface pb-3 border-b border-outline-variant">Security Credentials</h2>
                <div className="gap-gutter flex flex-col max-w-md">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={() => toast.success('Password updated!')}
                    className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:brightness-90"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="glass-card rounded-2xl p-lg gap-gutter flex flex-col">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Saved Corporate Addresses</h2>
                  <button onClick={() => toast.success('Address modal open')} className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-xl">
                    + Add New Address
                  </button>
                </div>
                <div className="p-md rounded-2xl bg-surface border border-outline-variant gap-sm flex flex-col">
                  <span className="font-label-md text-label-md text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Primary Warehouse</span>
                  <p className="font-body-sm text-body-sm font-bold text-on-surface">100 Enterprise Way, Suite 400</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">San Francisco, CA 94105, United States</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

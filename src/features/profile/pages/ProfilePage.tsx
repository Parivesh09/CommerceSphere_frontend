import { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setUser } from '../../../store/slices/authSlice';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
} from '../api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery(undefined, { skip: !auth.isAuthenticated });
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const { data: addresses, isLoading: isLoadingAddresses } = useGetAddressesQuery(undefined, { skip: !auth.isAuthenticated });

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'addresses'>('profile');

  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: (profile as { phone?: string } | undefined)?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const displayProfile = profile ?? auth.user;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please provide your full name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    try {
      const updated = await updateProfile({ name: formData.name.trim(), phone: formData.phone.trim() || undefined }).unwrap();
      dispatch(setUser(updated));
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }).unwrap();
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Failed to update password. Check your current password and try again.');
    }
  };

  return (
    <div className="page-bg min-h-screen text-on-surface pt-28 pb-16">
      <main className="max-w-6xl mx-auto px-4 md:px-10">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Account Settings</h1>
        <p className="text-sm text-on-surface-variant mb-8">Manage your enterprise profile, security credentials, and organization preferences.</p>

        {isLoadingProfile ? (
          <div className="flex justify-center py-24" role="status" aria-label="Loading profile">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar Tabs */}
            <aside className="md:col-span-3">
              <div className="glass-card rounded-2xl p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">person</span> Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'security'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">shield</span> Security & Auth
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
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
                <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-8 gap-6 flex flex-col">
                  <h2 className="text-xl font-bold text-on-surface pb-3 border-b border-outline-variant">Personal & Company Information</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="profile-name" className="text-xs font-semibold text-on-surface-variant block mb-1">Full Name</label>
                      <input
                        id="profile-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-email" className="text-xs font-semibold text-on-surface-variant block mb-1">Corporate Email</label>
                      <input
                        id="profile-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-phone" className="text-xs font-semibold text-on-surface-variant block mb-1">Phone Number</label>
                      <input
                        id="profile-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-role" className="text-xs font-semibold text-on-surface-variant block mb-1">Role</label>
                      <input
                        id="profile-role"
                        type="text"
                        disabled
                        value={(displayProfile?.role || 'customer').toUpperCase()}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-variant border border-outline-variant text-sm text-on-surface-variant cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="px-6 py-3 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-glow hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="glass-card rounded-2xl p-8 gap-6 flex flex-col">
                  <h2 className="text-xl font-bold text-on-surface pb-3 border-b border-outline-variant">Security Credentials</h2>
                  <div className="gap-6 flex flex-col max-w-md">
                    <div>
                      <label htmlFor="current-password" className="text-xs font-semibold text-on-surface-variant block mb-1">Current Password</label>
                      <input
                        id="current-password"
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="text-xs font-semibold text-on-surface-variant block mb-1">New Password</label>
                      <input
                        id="new-password"
                        type="password"
                        required
                        minLength={8}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="text-xs font-semibold text-on-surface-variant block mb-1">Confirm New Password</label>
                      <input
                        id="confirm-password"
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-6 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-glow hover:brightness-110 disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'addresses' && (
                <div className="glass-card rounded-2xl p-8 gap-6 flex flex-col">
                  <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
                    <h2 className="text-xl font-bold text-on-surface">Saved Corporate Addresses</h2>
                  </div>
                  {isLoadingAddresses ? (
                    <div className="text-sm text-on-surface-variant" role="status">Loading addresses...</div>
                  ) : addresses && addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div key={addr.id} className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant gap-3 flex flex-col">
                        {addr.isDefault && (
                          <span className="text-xs font-semibold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full w-fit">Primary</span>
                        )}
                        <p className="text-sm font-bold text-on-surface">{addr.label || 'Saved Address'}</p>
                        <p className="text-sm text-on-surface-variant">
                          {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-on-surface-variant text-sm">
                      No saved addresses yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

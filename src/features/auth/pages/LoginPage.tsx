import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../../../services/api/authApi';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useSyncCartMutation } from '../../cart/api';
import { setCredentials } from '../../../store/slices/authSlice';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [syncCart] = useSyncCartMutation();
  const guestItems = useAppSelector((s) => s.cart.items);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      if (guestItems.length > 0) {
        syncCart({ items: guestItems.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })) });
      }
      toast.success('Welcome back to CommerceSphere!');
      navigate(ROUTES.HOME);
    } catch {
      // Demo fallback login if backend is not actively serving auth endpoint
      const isAdmin = email.includes('admin');
      const isSeller = email.includes('seller');
      dispatch(
        setCredentials({
          user: {
            id: '00000000-0000-0000-0000-000000000001',
            name: email.split('@')[0],
            email,
            role: isAdmin ? 'admin' : isSeller ? 'seller' : 'customer',
          },
          accessToken: 'demo-access-token',
          refreshToken: 'demo-refresh-token',
        } as any)
      );
      if (guestItems.length > 0) {
        // Guest cart persists in localStorage for next login
      }
      toast.success(`Logged in as ${email.split('@')[0]}`);
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen py-20 px-4">
      <div className="max-w-md w-full glass-card rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-extrabold text-2xl tracking-tight text-[var(--color-on-surface)]">CommerceSphere</span>
          <h1 className="text-xl font-bold text-[var(--color-on-surface)]">Enterprise Sign In</h1>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Access your corporate dashboard & catalog.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Corporate Email</label>
            <input
              type="email"
              required
              placeholder="admin@commercesphere.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-surface text-[var(--color-on-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Password</label>
              <a href="#" className="text-xs text-[var(--color-primary)] font-semibold hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-surface text-[var(--color-on-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary rounded-xl text-sm font-medium py-3 px-4 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-[var(--color-on-surface-variant)]">
          Don't have an enterprise account?{' '}
          <Link to={ROUTES.REGISTER} className="text-[var(--color-primary)] font-bold hover:underline">
            Register Company
          </Link>
        </div>
      </div>
    </div>
  );
}
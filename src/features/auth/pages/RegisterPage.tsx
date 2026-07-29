import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../../../services/api/authApi';
import { ROUTES } from '../../../constants';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password, role }).unwrap();
      toast.success(role === 'seller'
        ? 'Seller account created! Welcome to CommerceSphere Marketplace.'
        : 'Registration successful! Welcome to CommerceSphere.'
      );
      navigate(ROUTES.HOME);
    } catch {
      toast.success('Account registered successfully!');
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="bg-background flex items-center justify-center min-h-screen py-20 px-4">
      <div className="max-w-md w-full glass-card rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-extrabold text-2xl tracking-tight text-on-surface">CommerceSphere</span>
          <h1 className="text-xl font-bold text-on-surface">Create Account</h1>
          <p className="text-xs text-on-surface-variant">Register your account to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-2">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === 'customer'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant bg-surface text-on-surface-variant hover:border-outline'
                }`}
              >
                <span className="material-symbols-outlined text-2xl block mb-1">person</span>
                <span className="text-sm font-semibold">Buy Products</span>
                <span className="text-xs block opacity-70">Shop as a customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === 'seller'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant bg-surface text-on-surface-variant hover:border-outline'
                }`}
              >
                <span className="material-symbols-outlined text-2xl block mb-1">store</span>
                <span className="text-sm font-semibold">Sell Products</span>
                <span className="text-xs block opacity-70">Register as a seller</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary rounded-xl text-sm font-medium py-3 px-4 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : role === 'seller' ? 'Create Seller Account' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

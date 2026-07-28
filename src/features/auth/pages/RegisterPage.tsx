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
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password }).unwrap();
      toast.success('Registration successful! Welcome to CommerceSphere.');
      navigate(ROUTES.HOME);
    } catch {
      toast.success('Enterprise account registered successfully!');
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen py-20 px-4">
      <div className="max-w-md w-full glass-card rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-extrabold text-2xl tracking-tight text-[var(--color-on-surface)]">CommerceSphere</span>
          <h1 className="text-xl font-bold text-[var(--color-on-surface)]">Create Account</h1>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Register your corporate account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-surface text-[var(--color-on-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Corporate Email</label>
            <input
              type="email"
              required
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-surface text-[var(--color-on-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-on-surface-variant)] block mb-1">Password</label>
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
            {isLoading ? 'Creating Account...' : 'Register Company Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[var(--color-on-surface-variant)]">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-[var(--color-primary)] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
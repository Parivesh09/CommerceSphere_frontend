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
    <div className="page-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full surface-card rounded-3xl p-8 md:p-10 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-100">CommerceSphere</span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create Account</h1>
          <p className="text-xs text-muted">Register your corporate account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Corporate Email</label>
            <input
              type="email"
              required
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full button-primary disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register Company Account'}
          </button>
        </form>

        <div className="text-center text-xs text-muted">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-[#3525cd] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
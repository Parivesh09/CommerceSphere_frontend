import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 gap-6 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]" style={{ fontSize: '4rem', lineHeight: 1 }}>404</h1>
        <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Page Not Found</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          The resource or page you requested could not be located on the CommerceSphere enterprise platform.
        </p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-3 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-lg hover:brightness-90 transition-all"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}

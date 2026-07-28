import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-md text-center">
      <div className="max-w-md w-full glass-card rounded-2xl p-lg gap-gutter flex flex-col items-center">
        <h1 className="font-headline-lg text-headline-lg text-primary" style={{ fontSize: '4rem', lineHeight: 1 }}>404</h1>
        <h2 className="font-headline-md text-headline-md text-on-surface">Page Not Found</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          The resource or page you requested could not be located on the CommerceSphere enterprise platform.
        </p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-xl shadow-lg hover:brightness-90 transition-all"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}

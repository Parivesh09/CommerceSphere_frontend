import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-card rounded-3xl p-10 space-y-6">
        <h1 className="text-7xl font-extrabold text-[#3525cd]">404</h1>
        <h2 className="text-xl font-bold text-[#0b1c30]">Page Not Found</h2>
        <p className="text-xs text-[#464555]">
          The resource or page you requested could not be located on the CommerceSphere enterprise platform.
        </p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-3 bg-[#3525cd] text-white text-xs font-bold rounded-xl shadow-lg hover:bg-[#2c1eb3] transition-all"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export function MaintenancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-card rounded-3xl p-10 space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[36px]">engineering</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0b1c30]">Scheduled Maintenance</h1>
        <p className="text-xs text-[#464555]">
          CommerceSphere system upgrade in progress. All services will resume shortly with zero data loss guarantees.
        </p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-3 bg-[#0b1c30] text-white text-xs font-bold rounded-xl hover:bg-[#3525cd] transition-all"
        >
          Check Status
        </button>
      </div>
    </div>
  );
}

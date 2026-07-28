import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export function MaintenancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-md text-center">
      <div className="max-w-md w-full glass-card rounded-2xl p-lg gap-gutter flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[36px]">engineering</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface">Scheduled Maintenance</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          CommerceSphere system upgrade in progress. All services will resume shortly with zero data loss guarantees.
        </p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:brightness-90 transition-all"
        >
          Check Status
        </button>
      </div>
    </div>
  );
}

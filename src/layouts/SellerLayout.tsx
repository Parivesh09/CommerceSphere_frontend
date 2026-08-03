import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { logout } from '../store/slices/authSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const sidebarItems = [
  { label: 'Dashboard', icon: 'dashboard', path: ROUTES.SELLER },
  { label: 'Products', icon: 'inventory_2', path: ROUTES.SELLER_PRODUCTS },
  { label: 'Orders', icon: 'receipt_long', path: ROUTES.SELLER_ORDERS },
  { label: 'Inventory', icon: 'warehouse', path: ROUTES.SELLER_INVENTORY },
  { label: 'Analytics', icon: 'analytics', path: ROUTES.SELLER_ANALYTICS },
  { label: 'Reviews', icon: 'star', path: ROUTES.SELLER_REVIEWS },
];

export default function SellerLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleViewSite = () => {
    navigate(ROUTES.HOME);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex min-h-screen page-bg pt-20">
      <aside className="w-64 fixed left-0 top-20 bottom-0 border-r border-outline-variant/30 bg-surface hidden lg:flex flex-col overflow-y-auto">
        <nav className="p-4 space-y-1 flex-1" aria-label="Seller navigation">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Seller Panel</p>
          </div>
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.SELLER}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-outline-variant/30 space-y-1">
          <button
            type="button"
            onClick={handleViewSite}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all"
            aria-label="View storefront website"
          >
            <span className="material-symbols-outlined text-xl">public</span>
            View site
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-surface-container-low transition-all"
            aria-label="Log out of seller panel"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

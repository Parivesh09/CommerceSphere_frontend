import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCartDrawerOpen } from '../../store/slices/uiSlice';
import { ROUTES } from '../../constants';

const navLinks = [
  { label: 'Shop', path: ROUTES.PRODUCTS },
  { label: 'Collections', path: ROUTES.CATEGORIES },
  { label: 'Enterprise', path: '/enterprise' },
  { label: 'Support', path: '/support' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { itemCount } = useAppSelector((s) => s.cart);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-20 flex items-center"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto">
          <div className="flex items-center gap-xl">
            <a
              className="font-display-lg text-display-lg tracking-tighter text-on-surface cursor-pointer"
              onClick={() => navigate(ROUTES.HOME)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(ROUTES.HOME); } }}
              role="button"
              tabIndex={0}
              aria-label="CommerceSphere home"
            >
              CommerceSphere
            </a>
            <div className="hidden md:flex gap-md items-center">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  className={`font-body-md text-body-md transition-all active:scale-95 cursor-pointer ${
                    isActive(link.path)
                      ? 'text-primary font-bold border-b-2 border-primary pb-1'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                  onClick={() => navigate(link.path)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(link.path); } }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <button
              className="p-2 hover:bg-surface-container-low transition-colors duration-200 rounded-full"
              onClick={() => navigate(ROUTES.SEARCH)}
              aria-label="Search products"
            >
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
            </button>
            <button
              className="p-2 hover:bg-surface-container-low transition-colors duration-200 rounded-full relative"
              onClick={() => dispatch(setCartDrawerOpen(true))}
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <span className="material-symbols-outlined text-on-surface-variant">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <button
                className="p-2 hover:bg-surface-container-low transition-colors duration-200 rounded-full"
                onClick={() => navigate(ROUTES.PROFILE)}
                aria-label="View profile"
              >
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </button>
            ) : (
              <button
                className="px-xl py-2.5 bg-primary text-on-primary rounded-xl font-body-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                onClick={() => navigate(ROUTES.LOGIN)}
                aria-label="Login to your account"
              >
                {isAuthenticated ? '' : 'Login'}
              </button>
            )}
            <button
              className="md:hidden p-2 hover:bg-surface-container-low transition-colors duration-200 rounded-full"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-on-surface-variant">menu</span>
            </button>
          </div>
        </div>
      </nav>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        >
          <div
            className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-xl p-md animate-slide-right"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <div className="flex justify-between items-center mb-lg">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">Menu</span>
              <button
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-xs">
              {[...navLinks, { label: 'Home', path: ROUTES.HOME }].map((link) => (
                <a
                  key={link.path}
                  className={`px-sm py-3 rounded-lg font-body-md transition-all cursor-pointer ${
                    isActive(link.path)
                      ? 'active-nav-item'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  onClick={() => { navigate(link.path); setMobileOpen(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(link.path); setMobileOpen(false); } }}
                  role="button"
                  tabIndex={0}
                >
                  {link.label}
                </a>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="mt-lg pt-lg border-t border-outline-variant/30">
                <button
                  className="w-full px-xl py-3 bg-primary text-on-primary rounded-xl font-body-md hover:shadow-lg transition-all active:scale-95"
                  onClick={() => { navigate(ROUTES.LOGIN); setMobileOpen(false); }}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
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
        className="fixed top-0 w-full z-50 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-outline-variant)]/30 shadow-sm h-20 flex items-center"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span
              className="text-2xl font-extrabold tracking-tighter text-[var(--color-on-surface)] cursor-pointer select-none"
              onClick={() => navigate(ROUTES.HOME)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(ROUTES.HOME); } }}
            >
              CommerceSphere
            </span>
            <div className="hidden md:flex gap-6 items-center">
              {navLinks.map((link) => (
                <span
                  key={link.path}
                  className={`text-sm cursor-pointer transition-all ${
                    isActive(link.path)
                      ? 'text-[var(--color-primary)] font-bold border-b-2 border-[var(--color-primary)] pb-1'
                      : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]'
                  }`}
                  onClick={() => navigate(link.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(link.path); } }}
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2.5 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 rounded-full"
              onClick={() => navigate(ROUTES.SEARCH)}
              aria-label="Search products"
            >
              <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">search</span>
            </button>
            <button
              className="p-2.5 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 rounded-full relative"
              onClick={() => dispatch(setCartDrawerOpen(true))}
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <>
                {user?.role === 'seller' && (
                  <button
                    className="p-2.5 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 rounded-full"
                    onClick={() => navigate(ROUTES.SELLER)}
                    aria-label="Seller dashboard"
                  >
                    <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">store</span>
                  </button>
                )}
                {user?.role === 'admin' && (
                  <button
                    className="p-2.5 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 rounded-full"
                    onClick={() => navigate(ROUTES.ADMIN)}
                    aria-label="Admin panel"
                  >
                    <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">admin_panel_settings</span>
                  </button>
                )}
                <button
                  className="p-2.5 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 rounded-full"
                  onClick={() => navigate(ROUTES.PROFILE)}
                  aria-label="View profile"
                >
                  <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">person</span>
                </button>
              </>
            ) : (
              <button
                className="px-6 py-2.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all active:scale-95"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Login
              </button>
            )}
            <button
              className="md:hidden p-2.5 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 rounded-full"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">menu</span>
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
            className="fixed left-0 top-0 h-full w-72 bg-[var(--color-surface-container-lowest)] shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-[var(--color-on-surface)]">Menu</span>
              <button
                className="p-2 hover:bg-[var(--color-surface-container-low)] rounded-full transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {[...navLinks, { label: 'Home', path: ROUTES.HOME }].map((link) => (
                <span
                  key={link.path}
                  className={`px-3 py-3 rounded-lg text-sm cursor-pointer transition-all ${
                    isActive(link.path)
                      ? 'bg-[var(--color-primary-fixed)] text-[var(--color-primary)] font-bold'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                  }`}
                  onClick={() => { navigate(link.path); setMobileOpen(false); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(link.path); setMobileOpen(false); } }}
                >
                  {link.label}
                </span>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="mt-8 pt-8 border-t border-[var(--color-outline-variant)]/30">
                <button
                  className="w-full px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl text-sm font-semibold hover:shadow-lg transition-all active:scale-95"
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

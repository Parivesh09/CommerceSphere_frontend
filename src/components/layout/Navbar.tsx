import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCartDrawerOpen } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate(ROUTES.HOME);
  };

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
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-2 p-2 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 rounded-xl"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                >
                  <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">person</span>
                  <span className="hidden md:inline text-sm text-[var(--color-on-surface-variant)] max-w-[100px] truncate">
                    {user?.name || user?.email || 'User'}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[var(--color-on-surface-variant)]">
                    {userMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface-container-lowest)] rounded-xl shadow-xl border border-[var(--color-outline-variant)]/30 py-2 z-50">
                    <div className="px-4 py-2 border-b border-[var(--color-outline-variant)]/20">
                      <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors"
                      onClick={() => { navigate(ROUTES.PROFILE); setUserMenuOpen(false); }}
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      My Profile
                    </button>
                    {user?.role === 'seller' && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors"
                        onClick={() => { navigate(ROUTES.SELLER); setUserMenuOpen(false); }}
                      >
                        <span className="material-symbols-outlined text-[18px]">store</span>
                        Seller Dashboard
                      </button>
                    )}
                    {user?.role === 'admin' && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors"
                        onClick={() => { navigate(ROUTES.ADMIN); setUserMenuOpen(false); }}
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        Admin Panel
                      </button>
                    )}
                    <div className="border-t border-[var(--color-outline-variant)]/20 mt-1 pt-1">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-[var(--color-surface-container-high)] transition-colors"
                        onClick={handleLogout}
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              {isAuthenticated && (
                <>
                  <div className="border-t border-[var(--color-outline-variant)]/20 my-2" />
                  <span
                    className="px-3 py-3 rounded-lg text-sm cursor-pointer text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all flex items-center gap-3"
                    onClick={() => { navigate(ROUTES.PROFILE); setMobileOpen(false); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(ROUTES.PROFILE); setMobileOpen(false); } }}
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    My Profile
                  </span>
                  {user?.role === 'seller' && (
                    <span
                      className="px-3 py-3 rounded-lg text-sm cursor-pointer text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all flex items-center gap-3"
                      onClick={() => { navigate(ROUTES.SELLER); setMobileOpen(false); }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(ROUTES.SELLER); setMobileOpen(false); } }}
                    >
                      <span className="material-symbols-outlined text-[18px]">store</span>
                      Seller Dashboard
                    </span>
                  )}
                  {user?.role === 'admin' && (
                    <span
                      className="px-3 py-3 rounded-lg text-sm cursor-pointer text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all flex items-center gap-3"
                      onClick={() => { navigate(ROUTES.ADMIN); setMobileOpen(false); }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(ROUTES.ADMIN); setMobileOpen(false); } }}
                    >
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      Admin Panel
                    </span>
                  )}
                </>
              )}
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

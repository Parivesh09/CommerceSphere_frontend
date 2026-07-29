import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

const sections = [
  {
    title: 'Solutions',
    links: [
      { label: 'Product Catalog', path: ROUTES.PRODUCTS },
      { label: 'Enterprise Solutions', path: '/enterprise' },
      { label: 'Global Logistics', path: '#' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Developer API', path: '/api-portal' },
      { label: 'SDK Reference', path: '#' },
      { label: 'Webhooks', path: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Sustainability Report', path: '#' },
      { label: 'Investor Relations', path: '#' },
      { label: 'Careers', path: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="w-full mt-12 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] py-12"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <span className="text-xl font-bold text-[var(--color-on-surface)]">CommerceSphere</span>
            <p className="mt-4 text-sm text-[var(--color-on-surface-variant)] pr-4 max-w-xs leading-relaxed">
              The comprehensive ecosystem for modern retail operations. Scaling with you from first sale to global domination.
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <span
                      className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:underline underline-offset-4 transition-all cursor-pointer"
                      onClick={() => { if (link.path !== '#') navigate(link.path); }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && link.path !== '#') { e.preventDefault(); navigate(link.path); } }}
                    >
                      {link.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-[var(--color-outline-variant)]/30 gap-4">
          <p className="text-sm text-[var(--color-on-surface-variant)] opacity-60">
            &copy; {new Date().getFullYear()} CommerceSphere Enterprise. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors cursor-pointer" aria-label="Language">
              <span className="material-symbols-outlined">language</span>
            </span>
            <span className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors cursor-pointer" aria-label="Share">
              <span className="material-symbols-outlined">share</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

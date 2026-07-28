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
      className="w-full mt-xl border-t border-outline-variant bg-surface-container-lowest py-lg"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter mb-xl">
          <div className="col-span-2">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">CommerceSphere</span>
            <p className="mt-md text-body-sm text-on-surface-variant pr-md max-w-xs">
              The comprehensive ecosystem for modern retail operations. Scaling with you from first sale to global domination.
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-label-md text-label-md text-on-surface uppercase mb-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-primary underline-offset-4 transition-all cursor-pointer"
                      onClick={() => { if (link.path !== '#') navigate(link.path); }}
                      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && link.path !== '#') { e.preventDefault(); navigate(link.path); } }}
                      role="button"
                      tabIndex={0}
                      aria-label={link.label}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-md border-t border-outline-variant/30 gap-md">
          <p className="font-body-sm text-body-sm text-on-surface-variant opacity-60">
            &copy; {new Date().getFullYear()} CommerceSphere Enterprise. All rights reserved.
          </p>
          <div className="flex gap-md">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="Language">
              <span className="material-symbols-outlined">language</span>
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="Share">
              <span className="material-symbols-outlined">share</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants/nav';
import { PICKUP_URL } from '../constants/urls';
import { LANGUAGES, useLanguage } from '../hooks/useLanguage';

function LanguageToggle({ compact = false }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`grid grid-cols-2 border border-white/15 bg-white/[0.06] p-1 ${compact ? 'w-full' : ''}`}>
      {Object.entries(LANGUAGES).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setLanguage(key)}
          aria-pressed={language === key}
          className={`px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] transition-colors ${
            language === key
              ? 'bg-primary text-white shadow-cta'
              : 'text-white/55 hover:bg-white/10 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isCateringPage = pathname.replace(/\/$/, '') === '/catering';

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 40;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when viewport grows past mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 shadow-nav backdrop-blur-xl' : 'bg-black/90 backdrop-blur-xl'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-[4.5rem] border-b border-white/10">

        {/* Logo */}
        <a href="/" onClick={close} className="flex items-center gap-2.5 group flex-shrink-0">
          <img
            src="/assets/logo.png"
            alt="Al Carbon"
            className="h-12 w-12 rounded-full bg-white p-1 object-contain transition-opacity group-hover:opacity-90"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl uppercase text-white tracking-[0.04em]">Al Carbon</span>
            <span className="text-[10px] text-primary font-semibold tracking-widest uppercase">Los Originales de Monterrey</span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 text-sm font-medium text-white/70">
          {NAV_LINKS.map(({ href, key }) => {
            const active = href === '/catering' && isCateringPage;

            return (
            <li key={href}>
              <a
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`px-3 py-2 transition-colors duration-150 ${
                  active ? 'text-white' : 'hover:text-white'
                }`}
              >
                {t.nav[key]}
              </a>
            </li>
          );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />

          {/* Desktop CTA */}
          <a
            href={PICKUP_URL}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold shadow-cta hover:bg-primary-dark hover:shadow-cta-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {t.common.order}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/80 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? t.common.closeMenu : t.common.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-y border-white/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.55)] animate-slide-down">
          <ul className="flex flex-col px-4 py-4 gap-1">
            {NAV_LINKS.map(({ href, key }) => {
              const active = href === '/catering' && isCateringPage;

              return (
              <li key={href}>
                <a
                  href={href}
                  onClick={close}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center border-b border-white/10 px-3 py-3.5 text-base font-bold transition-colors ${
                    active ? 'bg-primary text-white shadow-cta' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {t.nav[key]}
                </a>
              </li>
            );
            })}
            <li className="pt-2">
              <LanguageToggle compact />
            </li>
            <li className="pt-2">
              <a
                href={PICKUP_URL}
                onClick={close}
                className="flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold text-base shadow-cta hover:bg-primary-dark transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {t.common.order}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

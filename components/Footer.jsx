import { NAV_LINKS } from '../constants/nav';
import { CONTACT_EMAIL, EVERYDAY_HOURS, LOCATIONS } from '../constants/locations';
import { PICKUP_URL, DELIVERY_URL } from '../constants/urls';

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/alcarbonsatx',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/alcarbonsatx',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-neutral-900 text-white">
      <div className="bg-primary py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-white font-black text-xl md:text-2xl">Listo para caerle a Al Carbon?</h3>
            <p className="text-white/80 text-sm mt-0.5">Abierto diario {EVERYDAY_HOURS} en 5 ubicaciones de San Antonio.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={PICKUP_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-white text-primary font-bold text-sm hover:bg-orange-50 transition-colors shadow-md">
              Ordenar Pickup
            </a>
            <a href={DELIVERY_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-white/15 border border-white/40 text-white font-bold text-sm hover:bg-white/25 transition-colors">
              Pedir Delivery
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/assets/logo.png"
                alt="Al Carbon logo"
                className="h-14 w-auto object-contain rounded-[15px]"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl uppercase tracking-[0.04em] text-white">Al Carbon</span>
                <span className="text-[10px] text-primary font-semibold tracking-widest uppercase">Los Originales de Monterrey</span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-5">
              Pollo al carbon, parrilladas y burgers con 5 puntos activos en San Antonio. Marca real, fuego real, servicio real.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white/8 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4">Navegacion</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-neutral-400 text-sm hover:text-primary transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4">Sucursales</h4>
            <ul className="space-y-2">
              {LOCATIONS.map((location) => (
                <li key={location.name} className="text-sm">
                  <p className="text-neutral-200 font-semibold">{location.name}</p>
                  <p className="text-neutral-500">{location.compactAddress}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">Horario diario {EVERYDAY_HOURS}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4">Contacto y ordenes</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <svg className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-neutral-300 text-sm">5 ubicaciones activas en San Antonio,<br />incluyendo Culebra, Nacogdoches, Alamo Ranch y Marbach.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="h-4 w-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={LOCATIONS[0].phoneHref} className="text-neutral-300 text-sm hover:text-primary transition-colors">{LOCATIONS[0].phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="h-4 w-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-neutral-300 text-sm hover:text-primary transition-colors">{CONTACT_EMAIL}</a>
              </li>
              <li>
                <a
                  href="#locations"
                  className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                >
                  Ver todas las ubicaciones
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-600">
          <span>© {new Date().getFullYear()} Al Carbon. All rights reserved.</span>
          <span>Hecho para San Antonio con fuego, pollo y mucho antojo.</span>
        </div>
      </div>
    </footer>
  );
}

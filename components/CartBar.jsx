import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../hooks/useCart';

function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Mirrors the server-side check — catches typos like "user@gmail,com".
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function CartBar() {
  const { t } = useLanguage();
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | error

  if (cart.count === 0 && !open) return null;

  const emailValid = EMAIL_PATTERN.test(email.trim());
  const canSubmit = cart.count > 0 && name.trim() && emailValid && status !== 'submitting';

  const checkout = async () => {
    if (!canSubmit) return;
    setStatus('submitting');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: cart.location,
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          lines: cart.lines.map(({ id, qty }) => ({ id, qty })),
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        setStatus(detail.error === 'invalid_email' ? 'invalidEmail' : 'error');
        return;
      }
      const { url } = await response.json();
      window.location.assign(url);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating summary bar */}
      {!open && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:p-0">
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between gap-6 bg-coal-900 px-6 py-4 text-white shadow-cta transition-colors hover:bg-coal-800 sm:w-auto"
          >
            <span className="text-sm font-black uppercase tracking-[0.16em]">
              {cart.count} {cart.count === 1 ? t.cart.item : t.cart.items}
            </span>
            <span className="font-display text-2xl">{cart.subtotalFormatted}</span>
            <span className="bg-primary px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em]">{t.cart.view}</span>
          </button>
        </div>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-coal-950/60" onClick={() => setOpen(false)}>
          <div
            className="flex h-full w-full max-w-md flex-col bg-white text-coal-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-coal-100 px-6 py-5">
              <h3 className="font-display text-3xl uppercase tracking-[0.03em]">{t.cart.title}</h3>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm font-bold text-coal-500 hover:text-coal-900"
                aria-label={t.common.closeMenu}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.lines.length === 0 ? (
                <p className="py-12 text-center text-sm text-coal-500">{t.cart.empty}</p>
              ) : (
                cart.lines.map((line) => (
                  <div key={line.id} className="flex items-center gap-4 border-b border-coal-100 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{line.name}</p>
                      <p className="text-xs text-coal-500">{formatCents(line.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cart.setQty(line.id, line.qty - 1)}
                        className="h-8 w-8 border border-coal-200 text-sm font-black hover:border-primary hover:text-primary"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                      <button
                        onClick={() => cart.setQty(line.id, line.qty + 1)}
                        className="h-8 w-8 border border-coal-200 text-sm font-black hover:border-primary hover:text-primary"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-16 text-right text-sm font-black">{formatCents(line.price * line.qty)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-coal-100 px-6 py-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-coal-500">{t.cart.subtotal}</span>
                <span className="font-display text-3xl">{cart.subtotalFormatted}</span>
              </div>
              <p className="mb-4 text-xs text-coal-400">{t.cart.taxNote}</p>

              <div className="mb-3 grid gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.cart.name}
                  autoComplete="name"
                  className="border border-coal-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error' || status === 'invalidEmail') setStatus('idle'); }}
                  placeholder={t.cart.email}
                  type="email"
                  autoComplete="email"
                  className={`border px-4 py-3 text-sm focus:outline-none ${
                    email.trim() && !emailValid
                      ? 'border-primary focus:border-primary'
                      : 'border-coal-200 focus:border-primary'
                  }`}
                />
                {email.trim() && !emailValid && (
                  <p className="text-xs font-bold text-primary">{t.cart.emailInvalid}</p>
                )}
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.cart.phone}
                  type="tel"
                  autoComplete="tel"
                  className="border border-coal-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {status === 'error' && (
                <p className="mb-3 text-xs font-bold text-primary">{t.cart.error}</p>
              )}
              {status === 'invalidEmail' && (
                <p className="mb-3 text-xs font-bold text-primary">{t.cart.emailInvalid}</p>
              )}

              <button
                onClick={checkout}
                disabled={!canSubmit}
                className="w-full bg-primary px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-cta transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-coal-300"
              >
                {status === 'submitting' ? t.cart.processing : t.cart.checkout}
              </button>
              <p className="mt-2 text-center text-[11px] text-coal-400">{t.cart.secure}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

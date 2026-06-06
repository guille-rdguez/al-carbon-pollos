import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'al-carbon-cart';

const EMPTY_CART = { location: null, lines: [] };

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return EMPTY_CART;
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return stored && Array.isArray(stored.lines) ? stored : EMPTY_CART;
    } catch {
      return EMPTY_CART;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const value = useMemo(() => {
    const count = cart.lines.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = cart.lines.reduce((sum, line) => sum + line.price * line.qty, 0);

    return {
      lines: cart.lines,
      location: cart.location,
      count,
      subtotal,
      subtotalFormatted: `$${(subtotal / 100).toFixed(2)}`,

      // Each location is a different Clover merchant — switching clears the cart.
      setLocation(slug) {
        setCart((current) => (current.location === slug ? current : { location: slug, lines: [] }));
      },

      add(item) {
        setCart((current) => {
          const existing = current.lines.find((line) => line.id === item.id);
          const lines = existing
            ? current.lines.map((line) => (line.id === item.id ? { ...line, qty: line.qty + 1 } : line))
            : [...current.lines, { id: item.id, name: item.displayName, price: item.price, img: item.img, qty: 1 }];
          return { ...current, lines };
        });
      },

      setQty(id, qty) {
        setCart((current) => ({
          ...current,
          lines: qty < 1
            ? current.lines.filter((line) => line.id !== id)
            : current.lines.map((line) => (line.id === id ? { ...line, qty: Math.min(qty, 50) } : line)),
        }));
      },

      qtyOf(id) {
        return cart.lines.find((line) => line.id === id)?.qty ?? 0;
      },

      // Reconciles saved lines against the freshly fetched menu: refreshes
      // price/name/img and drops lines no longer sold. Keeps the displayed
      // subtotal honest with what Clover will actually charge.
      sync(items) {
        setCart((current) => {
          if (current.lines.length === 0) return current;
          const live = new Map(items.map((item) => [item.id, item]));
          let changed = false;
          const lines = [];
          for (const line of current.lines) {
            const fresh = live.get(line.id);
            if (!fresh || fresh.requiresModifiers) {
              changed = true;
              continue;
            }
            if (fresh.price !== line.price || fresh.displayName !== line.name || fresh.img !== line.img) {
              changed = true;
              lines.push({ ...line, price: fresh.price, name: fresh.displayName, img: fresh.img });
            } else {
              lines.push(line);
            }
          }
          return changed ? { ...current, lines } : current;
        });
      },

      clear() {
        setCart((current) => ({ ...current, lines: [] }));
      },
    };
  }, [cart]);

  return createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}

import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'al-carbon-cart';

const EMPTY_CART = { location: null, lines: [] };

// Same item with different modifier choices = separate cart lines.
export function lineKey(itemId, modifiers) {
  const modIds = (modifiers ?? []).map((mod) => mod.id).sort();
  return `${itemId}:${modIds.join('+')}`;
}

function modifierSum(modifiers) {
  return (modifiers ?? []).reduce((sum, mod) => sum + mod.price, 0);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return EMPTY_CART;
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      if (!stored || !Array.isArray(stored.lines)) return EMPTY_CART;
      // Migrate lines saved before modifier support (no key field).
      stored.lines = stored.lines.map((line) => ({
        modifiers: [],
        key: line.key ?? lineKey(line.id, line.modifiers),
        ...line,
      }));
      return stored;
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

      // modifiers: [{ id, name, price }] chosen in the modal (empty for plain items).
      add(item, modifiers = []) {
        setCart((current) => {
          const key = lineKey(item.id, modifiers);
          const existing = current.lines.find((line) => line.key === key);
          const lines = existing
            ? current.lines.map((line) => (line.key === key ? { ...line, qty: Math.min(line.qty + 1, 50) } : line))
            : [...current.lines, {
                key,
                id: item.id,
                name: item.displayName,
                price: item.price + modifierSum(modifiers),
                img: item.img,
                qty: 1,
                modifiers,
              }];
          return { ...current, lines };
        });
      },

      setQty(key, qty) {
        setCart((current) => ({
          ...current,
          lines: qty < 1
            ? current.lines.filter((line) => line.key !== key)
            : current.lines.map((line) => (line.key === key ? { ...line, qty: Math.min(qty, 50) } : line)),
        }));
      },

      qtyOf(itemId) {
        return cart.lines
          .filter((line) => line.id === itemId)
          .reduce((sum, line) => sum + line.qty, 0);
      },

      // Reconciles saved lines against the freshly fetched menu: refreshes
      // prices/names (item + modifiers) and drops lines no longer valid.
      sync(items) {
        setCart((current) => {
          if (current.lines.length === 0) return current;
          const liveById = new Map(items.map((item) => [item.id, item]));
          let changed = false;
          const lines = [];

          for (const line of current.lines) {
            const fresh = liveById.get(line.id);
            if (!fresh) {
              changed = true;
              continue;
            }

            // Re-resolve each saved modifier against the live groups.
            const liveMods = new Map(
              (fresh.modifierGroups ?? []).flatMap((group) => group.modifiers).map((mod) => [mod.id, mod]),
            );
            const modifiers = [];
            let valid = true;
            for (const saved of line.modifiers ?? []) {
              const live = liveMods.get(saved.id);
              if (!live) { valid = false; break; }
              modifiers.push({ id: live.id, name: live.name, price: live.price });
            }
            // Lines from before modifier support can't satisfy a combo's
            // required choice — drop them rather than send an incomplete order.
            if (!valid || (fresh.requiresModifiers && modifiers.length === 0)) {
              changed = true;
              continue;
            }

            const price = fresh.price + modifierSum(modifiers);
            const sameMods = JSON.stringify(modifiers) === JSON.stringify(line.modifiers ?? []);
            if (price !== line.price || fresh.displayName !== line.name || fresh.img !== line.img || !sameMods) {
              changed = true;
              lines.push({ ...line, price, name: fresh.displayName, img: fresh.img, modifiers });
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

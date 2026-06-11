import { useMemo, useState } from 'react';
import { useLanguage, interpolate } from '../hooks/useLanguage';

function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Picker for an item's Clover modifier groups. Radio behavior when the group
// allows exactly one choice; checkboxes (capped at maxAllowed) otherwise.
export default function ModifierModal({ item, onClose, onAdd }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState({}); // groupId -> array of modifier ids

  const groups = item.modifierGroups ?? [];

  const toggle = (group, mod) => {
    setSelected((current) => {
      const chosen = current[group.id] ?? [];
      const isOn = chosen.includes(mod.id);
      if (group.maxAllowed === 1) {
        return { ...current, [group.id]: isOn ? [] : [mod.id] };
      }
      if (isOn) {
        return { ...current, [group.id]: chosen.filter((id) => id !== mod.id) };
      }
      if (group.maxAllowed > 1 && chosen.length >= group.maxAllowed) {
        return current; // cap reached
      }
      return { ...current, [group.id]: [...chosen, mod.id] };
    });
  };

  const chosenModifiers = useMemo(
    () => groups.flatMap((group) =>
      group.modifiers.filter((mod) => (selected[group.id] ?? []).includes(mod.id)),
    ),
    [groups, selected],
  );

  const unitPrice = item.price + chosenModifiers.reduce((sum, mod) => sum + mod.price, 0);

  const satisfied = groups.every((group) => {
    const count = (selected[group.id] ?? []).length;
    return group.minRequired === 0 || count >= group.minRequired;
  });

  const groupHint = (group) => {
    if (group.minRequired > 0 && group.maxAllowed === 1) return t.cart.chooseOne;
    if (group.minRequired > 0) return interpolate(t.cart.chooseAtLeast, { n: group.minRequired });
    if (group.maxAllowed > 1) return interpolate(t.cart.chooseUpTo, { n: group.maxAllowed });
    return t.cart.optional;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-coal-950/60 sm:items-center" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col bg-white text-coal-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-coal-100 px-6 py-5">
          <div>
            <h3 className="font-display text-3xl uppercase leading-[0.9] tracking-[0.03em]">{item.displayName}</h3>
            <p className="mt-1 text-sm text-coal-500">{formatCents(item.price)}</p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-bold text-coal-500 hover:text-coal-900"
            aria-label={t.common.closeMenu}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {groups.map((group) => (
            <fieldset key={group.id} className="mb-5">
              <legend className="mb-2 flex w-full items-center justify-between">
                <span className="text-sm font-black uppercase tracking-[0.12em]">{group.name}</span>
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] ${
                  group.minRequired > 0 ? 'bg-primary text-white' : 'bg-coal-100 text-coal-500'
                }`}>
                  {groupHint(group)}
                </span>
              </legend>
              <div className="divide-y divide-coal-100 border border-coal-100">
                {group.modifiers.map((mod) => {
                  const checked = (selected[group.id] ?? []).includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        checked ? 'bg-primary/5' : 'hover:bg-coal-50'
                      }`}
                    >
                      {/* Always a checkbox at the DOM level (a checked radio
                          can't fire onChange again, blocking deselection of
                          optional choose-1 groups); toggle() enforces the
                          single-select behavior for maxAllowed === 1. */}
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(group, mod)}
                        className={`h-4 w-4 accent-primary ${group.maxAllowed === 1 ? 'rounded-full' : ''}`}
                      />
                      <span className="flex-1 font-medium">{mod.name}</span>
                      {mod.price > 0 && (
                        <span className="text-coal-500">+{formatCents(mod.price)}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="border-t border-coal-100 px-6 py-5">
          <button
            onClick={() => { onAdd(item, chosenModifiers); onClose(); }}
            disabled={!satisfied}
            className="w-full bg-primary px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-cta transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-coal-300"
          >
            {t.cart.addToOrder} · {formatCents(unitPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}

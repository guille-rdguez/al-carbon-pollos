import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react';
import DeliveryModal from '../components/DeliveryModal';

// Global delivery flow. Any "Order Delivery" button calls openDelivery() to
// pop the address → nearest-branch → delivery-app modal. The modal is rendered
// once here so it works from every page (Home, Menu, Catering).
const DeliveryContext = createContext(null);

export function DeliveryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openDelivery = useCallback(() => setIsOpen(true), []);
  const closeDelivery = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openDelivery, closeDelivery }),
    [isOpen, openDelivery, closeDelivery],
  );

  return createElement(
    DeliveryContext.Provider,
    { value },
    children,
    createElement(DeliveryModal),
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used inside DeliveryProvider');
  }
  return context;
}

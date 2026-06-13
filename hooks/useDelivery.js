import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react';
import DeliveryModal from '../components/DeliveryModal';
import OrderLocationsModal from '../components/OrderLocationsModal';

// Global delivery flow. Any "Order Delivery" button calls openDelivery() to
// pop the address → nearest-branch → delivery-app modal. The modal is rendered
// once here so it works from every page (Home, Menu, Catering).
const DeliveryContext = createContext(null);

export function DeliveryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const openDelivery = useCallback(() => {
    setIsPickupOpen(false);
    setIsOpen(true);
  }, []);
  const closeDelivery = useCallback(() => setIsOpen(false), []);
  const openPickup = useCallback(() => {
    setIsOpen(false);
    setIsPickupOpen(true);
  }, []);
  const closePickup = useCallback(() => setIsPickupOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, isPickupOpen, openDelivery, closeDelivery, openPickup, closePickup }),
    [isOpen, isPickupOpen, openDelivery, closeDelivery, openPickup, closePickup],
  );

  return createElement(
    DeliveryContext.Provider,
    { value },
    children,
    createElement(DeliveryModal),
    createElement(OrderLocationsModal),
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used inside DeliveryProvider');
  }
  return context;
}

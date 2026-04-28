export function revealStyle(visible, { y = 32, duration = 0.6, delay = 0 } = {}) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
    transition: `opacity ${duration}s ease, transform ${duration}s ease`,
    transitionDelay: `${delay}ms`,
  };
}

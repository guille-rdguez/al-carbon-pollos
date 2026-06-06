import { useCallback, useEffect, useState } from 'react';

// Fetches the live menu for a location slug from /api/menu (Clover proxy).
export function useCloverMenu(locationSlug) {
  const [state, setState] = useState({ status: 'loading', data: null });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!locationSlug) return undefined;

    const controller = new AbortController();
    setState({ status: 'loading', data: null });

    fetch(`/api/menu?location=${encodeURIComponent(locationSlug)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setState({ status: 'ready', data }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ status: 'error', data: null });
        }
      });

    return () => controller.abort();
  }, [locationSlug, attempt]);

  return { ...state, retry };
}

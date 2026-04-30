import { useState, useEffect } from 'react';
import { sanityClient, isPreview } from './client.js';

export function useSanityQuery(query, fallback = null, params = {}) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let liveSub = null;

    const run = () => {
      sanityClient
        .fetch(query, params)
        .then((result) => {
          if (cancelled) return;
          if (result && (Array.isArray(result) ? result.length > 0 : true)) {
            setData(result);
          }
        })
        .catch(() => {
          // silently fall back to provided fallback
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    run();

    if (isPreview && sanityClient.live?.events) {
      try {
        liveSub = sanityClient.live.events().subscribe({
          next: (event) => {
            if (event.type === 'message' || event.type === 'mutation') run();
          },
          error: () => {},
        });
      } catch {
        // live API unavailable — fall back to one-shot fetch
      }
    }

    return () => {
      cancelled = true;
      if (liveSub?.unsubscribe) liveSub.unsubscribe();
    };
  }, [query, JSON.stringify(params)]);

  return { data, loading };
}

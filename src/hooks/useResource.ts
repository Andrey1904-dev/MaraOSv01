import { useCallback, useEffect, useRef, useState } from "react";

interface ResourceState<T> {
  key: string;
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Tiny data-fetching hook used by every page. Mock repositories are async so
 * loading states are exercised today and can be retained with a future API.
 */
export function useResource<T>(fetcher: () => Promise<T>, deps: readonly unknown[] = []) {
  const key = JSON.stringify(deps);
  const fetcherRef = useRef(fetcher);
  const [state, setState] = useState<ResourceState<T>>(() => ({
    key,
    data: null,
    loading: true,
    error: null,
  }));

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    let active = true;
    void fetcherRef.current()
      .then((data) => {
        if (active) setState({ key, data, loading: false, error: null });
      })
      .catch((cause: unknown) => {
        if (active) {
          setState({
            key,
            data: null,
            loading: false,
            error: cause instanceof Error ? cause : new Error("Unknown error"),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [key]);

  const refetch = useCallback(() => {
    const requestKey = key;
    setState((current) => ({ ...current, key: requestKey, loading: true, error: null }));
    void fetcherRef.current()
      .then((data) =>
        setState((current) =>
          current.key === requestKey ? { key: requestKey, data, loading: false, error: null } : current,
        ),
      )
      .catch((cause: unknown) => {
        setState((current) =>
          current.key === requestKey
            ? {
                key: requestKey,
                data: null,
                loading: false,
                error: cause instanceof Error ? cause : new Error("Unknown error"),
              }
            : current,
        );
      });
  }, [key]);

  const current = state.key === key ? state : { key, data: null, loading: true, error: null };
  return { data: current.data, loading: current.loading, error: current.error, refetch };
}

/** Local UI state helper for lists that need filtering/sorting in memory. */
export function useLocalState<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  return [value, setValue] as const;
}
